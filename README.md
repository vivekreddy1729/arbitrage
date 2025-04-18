# Arbitrage Betting Calculator Chrome Extension

A comprehensive Chrome extension that helps calculate potential profits for arbitrage betting across multiple scenarios. This tool provides three specialized calculators to help you find and analyze arbitrage opportunities.

## What is Arbitrage Betting?

Arbitrage betting (also known as sure bets or miracle bets) is a technique where you place bets on all possible outcomes of an event at odds that guarantee a profit regardless of the result. By placing proportional bets on different outcomes with different bookmakers, you can secure a profit no matter which team wins.

## Features

### 1. Ratio Calculator
- Input the odds ratio for Team 1 and your bet amount
- Automatically calculate the required odds ratio for Team 2 to achieve:
  - 0% profit (break-even)
  - 10% profit
  - 25% profit
  - 50% profit
  - 100% profit
- Shows the exact amount to bet on Team 2 for each profit target
- Detailed information dialog showing complete profit scenarios

### 2. Payout Calculator
- Input odds ratios for both Team 1 and Team 2
- Enter your bet amount for Team 1 (defaults to $100)
- Automatically calculates:
  - How much to bet on Team 2 for optimal arbitrage
  - Total investment across both bets
  - Guaranteed profit amount and percentage
- Color-coded results showing profit/loss status

### 3. Required Odds Calculator
- Perfect for when you've already placed a bet on Team 1
- Input Team 1 odds and bet amount (what you've already bet)
- Input Team 2 bet amount (how much you have available to bet)
- Input current Team 2 odds
- Analyzes if this creates a profitable arbitrage opportunity
- Shows detailed profit/loss for each outcome

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension icon should now appear in your Chrome toolbar

## How to Use

### Ratio Calculator
1. Enter the odds ratio for Team 1 (e.g., 2.50)
2. Enter your bet amount (defaults to $100)
3. Click "Calculate"
4. View the required odds ratios for Team 2 to achieve different profit levels
5. Click on any result to see detailed bet information

### Payout Calculator
1. Enter the odds ratio for Team 1 (e.g., 2.50)
2. Enter the odds ratio for Team 2 (e.g., 1.75)
3. Enter your bet amount for Team 1 (defaults to $100)
4. Click "Calculate Payout"
5. View your optimal bet distribution and potential profit

### Required Odds Calculator
1. Enter the odds for Team 1 (where you've already placed a bet)
2. Enter your Team 1 stake (how much you've already bet)
3. Enter your available Team 2 stake
4. Enter the current Team 2 odds available to you
5. Click "Calculate Profit"
6. View if this creates a profitable arbitrage opportunity

## Formulas Used

### Ratio Calculator
```
Required Team 2 Ratio = (Team1Ratio * (1 + TargetProfit)) / (Team1Ratio - (1 + TargetProfit))
Team 2 Bet Amount = (Team1Bet * Team1Ratio) / Team2Ratio
```

### Payout Calculator
```
Team 2 Bet Amount = (Team1Bet * Team1Ratio) / Team2Ratio
Total Investment = Team1Bet + Team2Bet
Potential Winnings = Team1Bet * Team1Ratio
Profit = PotentialWinnings - TotalInvestment
Profit Percentage = (Profit / TotalInvestment) * 100
```

### Required Odds Calculator
```
Total Investment = Team1Bet + Team2Bet
Team 1 Winnings = Team1Bet * Team1Ratio
Team 2 Winnings = Team2Bet * Team2Ratio
Profit if Team 1 Wins = Team1Winnings - TotalInvestment
Profit if Team 2 Wins = Team2Winnings - TotalInvestment
```

## Tips for Arbitrage Betting

- Act quickly as odds can change rapidly
- Always account for betting fees when placing real bets
- Use decimal odds format for most accurate calculations
- Start with small stakes until you're comfortable with the process
- Verify all calculations before placing actual bets

## Limitations

- The calculator assumes decimal odds format
- Calculations do not account for bookmaker fees or commissions
- Limited to two-outcome scenarios (doesn't handle draws or multiple outcomes)

## Privacy

This extension performs all calculations locally and does not send any data to external servers. Your betting information remains private on your device.
