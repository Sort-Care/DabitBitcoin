# -*- coding: utf-8 -*-
# The line above is for adding Chinese comments

import math

class holder:
    """
    Class for a common coin holder. 
    """
    def __init__(email, referrer = None):
        # set email address
        self.email = email
        # set referrer
        self.referrer = referrer

class DabitCoin:
    """
    This is a class imitating the structure of a smart contract.
    """

    def __init__():
        self.difficulty_base = 25
        self.fee_deduction_tag = False
        


    def transaction(sender, receiver, amount, gas, timestamp):
        """
        Make a transaction
        进行交易
        Input:
        Output:
        """
        pass

    def mineCoin(locked_amount, stage):
        """
        Return transaction fees in the form of self-defined coin
        交易挖矿函数，挖矿困难度决定挖矿速率，挖矿困难度由基本挖矿难度和
        用户锁仓量共同决定
        Input:
          difficulty_base: 基准难度
          locked_amount: 锁仓量
          stage: 奖励级联递减阶段
        Output:
        """
        pass

    def distributeRevenue(holding_amount):
        """
        Distribute platform's revenue based on user's holding amount 
        收入分红，分红与用户持仓量直接挂钩
        Input:
        Output:
        """
        pass


    def referalBonus(referrer, referee):
        """
        Recommended user's partial transaction fee goes to his/her referrer
        推荐反佣
        Input:
        Output:
        """
        pass
