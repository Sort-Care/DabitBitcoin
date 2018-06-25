import math
import time
from fcoin3 import Fcoin
from collections import defaultdict
import config
from threading import Thread
from balance import balance
import json


class Fteth():
    def __init__(self):
        # initialize the Fcoin API
        self.fcoin = Fcoin()
        self.fcoin.auth(config.api_key, config.api_secret)

        self.symbol = 'fteth'
        self.order_id = None
        self.dic_balance = defaultdict(lambda: None)
        self.time_order = time.time()
        self.oldprice = [self.digits(self.get_ticker(), 6)]
        # don't quite know what are these
        self.eth_sxf = 0.0
        self.ft_sxf = 0.0
        self.begin_balance = self.get_balance()

    def digits(self, num, digit):
        '''
        Get rid of decimals after number of [num] digits
        '''
        site = pow(10, digit)
        tmp = num * site
        tmp = math.floor(tmp)/site
        return tmp

    def get_ticker(self):
        ticker = self.fcoin.get_market_ticker(self.symbol)
        current_price = ticker['data']['ticker'][0]
        print('new trade price: ', current_price)
        return current_price

    def get_balance(self):
        dic_balance = defaultdict(lambda: None)
        data = self.fcoin.get_balance()
        if data:
            for item in data['data']:
                dic_balance[item['currency']] = balance(float(item['available']),
                                                        float(item['frozen']),
                                                        float(item['balance']))
        return dic_balance

    def process(self):
        price = self.digits(self.get_ticker(), 8)

        self.oldprice.append(price)
        self.dic_balance = self.get_balance()
        ft = self.dic_balance['ft']
        eth = self.dic_balance['eth']

        
        order_list = self.fcoin.list_orders(symbol = self.symbol,
                                            states = 'submitted')['data']

        if not order_list or len(order_list) < 2:
            # make sure we will make profit from this
            # check eth balance and current price
            if eth and abs(price/self.oldprice[len(self.oldprice) - 2] -1) < 0.02:
                # if the price is above the average of 2 latest prices
                
                if price * 2 > self.oldprice[len(self.oldprice) -2] + self.oldprice[len(self.oldprice)-3]:
                    # calculate amount to buy
                    amount = self.digits(ft.available * 0.25, 2)

                    if amount > 5:
                        # but some FT
                        data = self.fcoin.sell(self.symbol, price, amount)
                        # if the trade is success
                        if data:
                            self.ft_sxf += amount * 0.001
                            self.order_id = data['data']
                            self.time_order = time.time()
                    else:
                        if float(ft.available) * 0.25 > 5:
                            # use 25 precentage
                            amount = self.digits()
                            data = self.fcoin.sell(self.symbol, price, amount)
                            if data:
                                # record transaction fee
                                self.eth_sxf += amount * price * 0.001
                                # record time
                                self.time_order = time.time()
                                #
                                self.order_id = data['data']
                                print('sell success')
                else:
                    print('error')
            else:
                print('system busy')
                if len(order_list) >= 1:
                    data = self.fcoin.cancel_order(order_list[len(order_list) - 1]['id'])
                    print(order_list[len(order_list) - 1])
                    if data:
                        if order_list[len(order_list)-1]['side'] == 'buy' and order_list[len(order_list) - 1]['symbol'] == 'fteth':
                            self.ft_sxf -= float(order_list[len(order_list) - 1]['amount']) * 0.001
                        elif order_list[len(order_list)-1]['side'] == 'sell' and order_list[len(order_list) - 1]['symbol'] == 'fteth':
                            self.eth_sxf -= float(order_list[len(order_list) - 1]['amount']) * float(order_list[len(order_list) - 1]['price']) * 0.001

    def loop(self):
        while True:
            try:
                self.process()
                print('success')
            except:
                print('err')
            time.sleep(5)



if __name__=='__main__':
    run = Fteth()
    thread = Thread(target = run.loop)
    thread.start()
    thread.join()
    print('done')
