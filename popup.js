document.addEventListener('DOMContentLoaded', function() {
  // ----- MODAL DIALOG SETUP -----
  const modal = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  
  // Modal detail elements
  const modalTeam1Bet = document.getElementById('modal-team1-bet');
  const modalTeam2Bet = document.getElementById('modal-team2-bet');
  const modalTotalInvestment = document.getElementById('modal-total-investment');
  const modalPotentialWinnings = document.getElementById('modal-potential-winnings');
  const modalProfitAmount = document.getElementById('modal-profit-amount');
  const modalProfitPercentage = document.getElementById('modal-profit-percentage');
  
  // Close modal when close button is clicked
  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Function to show modal with bet details
  function showBetDetails(team1Bet, team2Bet, team1Ratio, team2Ratio) {
    const totalInvestment = team1Bet + team2Bet;
    const team1Winnings = team1Bet * team1Ratio;
    const team2Winnings = team2Bet * team2Ratio;
    
    // For perfect arbitrage, both should be equal (within rounding error)
    const potentialWinnings = team1Winnings;
    const potentialProfit = potentialWinnings - totalInvestment;
    const profitPercentage = (potentialProfit / totalInvestment) * 100;
    
    // Update modal content
    modalTeam1Bet.textContent = `$${team1Bet.toFixed(2)}`;
    modalTeam2Bet.textContent = `$${team2Bet.toFixed(2)}`;
    modalTotalInvestment.textContent = `$${totalInvestment.toFixed(2)}`;
    modalPotentialWinnings.textContent = `$${potentialWinnings.toFixed(4)}`;
    
    // Set profit/loss with appropriate styling
    if (Math.abs(potentialProfit) < 0.0001) { // Handle zero profit (break-even) case with higher precision
      modalProfitAmount.textContent = `$0.0000`;
      modalProfitAmount.className = 'modal-detail-value';
      
      modalProfitPercentage.textContent = `0.0000%`;
      modalProfitPercentage.className = 'modal-detail-value';
    } else if (potentialProfit > 0) {
      modalProfitAmount.textContent = `$${potentialProfit.toFixed(4)}`;
      modalProfitAmount.className = 'modal-detail-value positive';
      
      modalProfitPercentage.textContent = `${profitPercentage.toFixed(4)}%`;
      modalProfitPercentage.className = 'modal-detail-value positive';
    } else {
      modalProfitAmount.textContent = `-$${Math.abs(potentialProfit).toFixed(4)}`;
      modalProfitAmount.className = 'modal-detail-value negative';
      
      modalProfitPercentage.textContent = `-${Math.abs(profitPercentage).toFixed(4)}%`;
      modalProfitPercentage.className = 'modal-detail-value negative';
    }
    
    // Show the modal
    modal.style.display = 'flex';
  }
  
  // ----- TAB SWITCHING FUNCTIONALITY -----
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and hide all content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.add('hidden'));
      
      // Add active class to clicked button and show corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.remove('hidden');
    });
  });
  
  // ----- RATIO CALCULATOR TAB -----
  
  // Get DOM elements for ratio calculator
  const team1RatioInput = document.getElementById('team1-ratio');
  const betAmountInput = document.getElementById('bet-amount');
  const betAmountDisplay = document.getElementById('bet-amount-display');
  const calculateBtn = document.getElementById('calculate-btn');
  
  // Profit target cells
  const profit0Cell = document.getElementById('profit-0');
  const profit10Cell = document.getElementById('profit-10');
  const profit25Cell = document.getElementById('profit-25');
  const profit50Cell = document.getElementById('profit-50');
  const profit100Cell = document.getElementById('profit-100');
  
  // Add event listener to calculate button
  calculateBtn.addEventListener('click', calculateArbitrage);
  
  // Also calculate when Enter key is pressed in the input fields
  team1RatioInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateArbitrage();
    }
  });
  
  betAmountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateArbitrage();
    }
  });
  
  function calculateArbitrage() {
    // Get the team 1 ratio from input
    const team1Ratio = parseFloat(team1RatioInput.value);
    
    // Get bet amount (default to 100 if not specified)
    let betAmount = parseFloat(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      betAmount = 100;
      betAmountInput.value = '100';
    }
    
    // Update bet amount display
    betAmountDisplay.textContent = `(for $${betAmount.toFixed(2)} bet on Team 1)`;
    
    // Validate input
    if (isNaN(team1Ratio) || team1Ratio <= 1) {
      alert('Please enter a valid ratio greater than 1.00');
      return;
    }
    
    // Calculate required team 2 ratios for different profit targets
    const breakEvenRatio = calculateRequiredRatio(team1Ratio, 0);
    const profit10Ratio = calculateRequiredRatio(team1Ratio, 0.1);
    const profit25Ratio = calculateRequiredRatio(team1Ratio, 0.25);
    const profit50Ratio = calculateRequiredRatio(team1Ratio, 0.5);
    const profit100Ratio = calculateRequiredRatio(team1Ratio, 1.0);
    
    // Display results with additional information
    displayResult(profit0Cell, breakEvenRatio, team1Ratio, betAmount, 0);
    displayResult(profit10Cell, profit10Ratio, team1Ratio, betAmount, 0.1);
    displayResult(profit25Cell, profit25Ratio, team1Ratio, betAmount, 0.25);
    displayResult(profit50Cell, profit50Ratio, team1Ratio, betAmount, 0.5);
    displayResult(profit100Cell, profit100Ratio, team1Ratio, betAmount, 1.0);
  }
  
  /**
   * Display the result with additional betting information
   * 
   * @param {HTMLElement} cell - The cell to display the result in
   * @param {number} team2Ratio - The calculated ratio for team 2
   * @param {number} team1Ratio - The input ratio for team 1
   * @param {number} team1Bet - The bet amount for team 1
   * @param {number} targetProfit - The target profit as a decimal
   */
  function displayResult(cell, team2Ratio, team1Ratio, team1Bet, targetProfit) {
    if (team2Ratio === Infinity || team2Ratio <= 1) {
      cell.innerHTML = '<span style="color: red;">Not possible</span>';
      return;
    }
    
    // Calculate bet distribution
    const team2Bet = (team1Bet * team1Ratio) / team2Ratio;
    
    // Calculate total investment and potential profit
    const totalInvestment = team1Bet + team2Bet;
  
    // Calculate winnings for both scenarios
    const team1Winnings = team1Bet * team1Ratio;
    const team2Winnings = team2Bet * team2Ratio;
  
    // For perfect arbitrage, both should be equal (within rounding error)
    const potentialWinnings = team1Winnings;
    const potentialProfit = potentialWinnings - totalInvestment;
    const profitPercentage = (potentialProfit / totalInvestment) * 100;
  
    // Check if the calculated profit matches the target profit
    const isTargetMet = Math.abs(profitPercentage - (targetProfit * 100)) < 0.01; // Allow smaller rounding error with higher precision
    
    // If target profit is not met, show as insufficient
    if (!isTargetMet && targetProfit > 0) {
      const resultSpan = document.createElement('span');
      resultSpan.textContent = `${team2Ratio.toFixed(4)} (insufficient)`;
      resultSpan.addEventListener('click', () => {
        showBetDetails(team1Bet, team2Bet, team1Ratio, team2Ratio);
      });
      
      cell.innerHTML = '';
      cell.appendChild(resultSpan);
      return;
    }
    
    // Create result element with click handler for detailed view
    const resultSpan = document.createElement('span');
    resultSpan.innerHTML = `${team2Ratio.toFixed(4)} <small>($${team2Bet.toFixed(2)} on Team 2)</small>`;
    resultSpan.addEventListener('click', () => {
      showBetDetails(team1Bet, team2Bet, team1Ratio, team2Ratio);
    });
    
    cell.innerHTML = '';
    cell.appendChild(resultSpan);
  }
  
  /**
   * Calculate the required ratio for team 2 to achieve the target profit
   * 
   * @param {number} team1Ratio - The odds ratio for team 1
   * @param {number} targetProfit - The target profit as a decimal (e.g., 0.1 for 10%)
   * @return {number} The required odds ratio for team 2
   */
  function calculateRequiredRatio(team1Ratio, targetProfit) {
    // For arbitrage betting, we need to solve for team2Ratio such that:
    // (1 + targetProfit) = (team1Ratio * team2Ratio) / (team1Ratio + team2Ratio)
    
    // Rearranging the formula to solve for team2Ratio:
    // team2Ratio = (team1Ratio * (1 + targetProfit)) / (team1Ratio - (1 + targetProfit))
    
    const numerator = team1Ratio * (1 + targetProfit);
    const denominator = team1Ratio - (1 + targetProfit);
    
    // If denominator is zero or negative, it means the target profit is impossible
    if (denominator <= 0) {
      return Infinity;
    }
    
    return numerator / denominator;
  }
  
  // ----- PAYOUT CALCULATOR TAB -----
  
  // Get DOM elements for payout calculator
  const payoutTeam1RatioInput = document.getElementById('payout-team1-ratio');
  const payoutTeam2RatioInput = document.getElementById('payout-team2-ratio');
  const payoutBetAmountInput = document.getElementById('payout-bet-amount');
  const payoutBetAmountDisplay = document.getElementById('payout-bet-amount-display');
  const calculatePayoutBtn = document.getElementById('calculate-payout-btn');
  
  // Result elements
  const team2BetAmountEl = document.getElementById('team2-bet-amount');
  const totalInvestmentEl = document.getElementById('total-investment');
  const potentialProfitEl = document.getElementById('potential-profit');
  const profitPercentageEl = document.getElementById('profit-percentage');
  
  // Add event listener to calculate payout button
  calculatePayoutBtn.addEventListener('click', calculatePayout);
  
  // Also calculate when Enter key is pressed in any input field
  payoutTeam1RatioInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && payoutTeam2RatioInput.value) {
      calculatePayout();
    }
  });
  
  payoutTeam2RatioInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && payoutTeam1RatioInput.value) {
      calculatePayout();
    }
  });
  
  payoutBetAmountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && payoutTeam1RatioInput.value && payoutTeam2RatioInput.value) {
      calculatePayout();
    }
  });
  
  function calculatePayout() {
    // Get the team ratios from inputs
    const team1Ratio = parseFloat(payoutTeam1RatioInput.value);
    const team2Ratio = parseFloat(payoutTeam2RatioInput.value);
    
    // Get bet amount (default to 100 if not specified)
    let betAmount = parseFloat(payoutBetAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
      betAmount = 100;
      payoutBetAmountInput.value = '100';
    }
    
    // Update bet amount display
    payoutBetAmountDisplay.textContent = `(for $${betAmount.toFixed(2)} bet on Team 1)`;
    
    // Validate inputs
    if (isNaN(team1Ratio) || team1Ratio <= 1 || isNaN(team2Ratio) || team2Ratio <= 1) {
      alert('Please enter valid ratios greater than 1.00 for both teams');
      return;
    }
    
    // Calculate with custom bet on Team 1
    const team1Bet = betAmount;
    
    // For perfect arbitrage, we need to calculate team2Bet so that:
    // team1Bet * team1Ratio = team2Bet * team2Ratio
    // This ensures the same payout regardless of which team wins
    const team2Bet = (team1Bet * team1Ratio) / team2Ratio;
    
    // Calculate total investment and potential profit
    const totalInvestment = team1Bet + team2Bet;
    
    // For perfect arbitrage, the potential winnings should be the same regardless of which team wins
    const team1Winnings = team1Bet * team1Ratio;
    const team2Winnings = team2Bet * team2Ratio;
    
    // Verify that both scenarios yield the same winnings (within a small rounding error)
    const potentialWinnings = team1Winnings;
    const potentialProfit = potentialWinnings - totalInvestment;
    const profitPercentage = (potentialProfit / totalInvestment) * 100;
    
    // Display results
    team2BetAmountEl.textContent = `$${team2Bet.toFixed(2)}`;
    totalInvestmentEl.textContent = `$${totalInvestment.toFixed(2)}`;
  
    // Add color classes based on profit/loss
    if (Math.abs(potentialProfit) < 0.0001) { // Handle zero profit (break-even) case with higher precision
      potentialProfitEl.textContent = `$0.0000`;
      potentialProfitEl.className = 'result-value';
      
      profitPercentageEl.textContent = `0.0000%`;
      profitPercentageEl.className = 'result-value';
    } else if (potentialProfit > 0) {
      potentialProfitEl.textContent = `$${potentialProfit.toFixed(4)}`;
      potentialProfitEl.className = 'result-value positive';
      
      profitPercentageEl.textContent = `${profitPercentage.toFixed(4)}%`;
      profitPercentageEl.className = 'result-value positive';
    } else {
      potentialProfitEl.textContent = `-$${Math.abs(potentialProfit).toFixed(4)}`;
      potentialProfitEl.className = 'result-value negative';
      
      profitPercentageEl.textContent = `-${Math.abs(profitPercentage).toFixed(4)}%`;
      profitPercentageEl.className = 'result-value negative';
    }
    
    // Make the result cards clickable to show detailed information
    const resultCards = document.querySelectorAll('.payout-results .result-card');
    resultCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        showBetDetails(team1Bet, team2Bet, team1Ratio, team2Ratio);
      });
    });
  }
  
  // ----- REQUIRED ODDS CALCULATOR TAB -----
  
  // Get DOM elements for required odds calculator
  const requiredTeam1RatioInput = document.getElementById('required-team1-ratio');
  const requiredTeam1BetInput = document.getElementById('required-team1-bet');
  const requiredTeam2BetInput = document.getElementById('required-team2-bet');
  const requiredTeam2RatioInput = document.getElementById('required-team2-ratio');
  const calculateRequiredBtn = document.getElementById('calculate-required-btn');
  const requiredBetAmountDisplay = document.getElementById('required-bet-amount-display');
  
  // Result elements
  const requiredTotalInvestmentEl = document.getElementById('required-total-investment');
  const requiredPotentialProfitEl = document.getElementById('required-potential-profit');
  const requiredProfitPercentageEl = document.getElementById('required-profit-percentage');
  
  // Add event listener to calculate required odds button
  calculateRequiredBtn.addEventListener('click', calculateRequiredOdds);
  
  // Also calculate when Enter key is pressed in any input field
  requiredTeam1RatioInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateRequiredOdds();
    }
  });
  
  requiredTeam1BetInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateRequiredOdds();
    }
  });
  
  requiredTeam2BetInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateRequiredOdds();
    }
  });
  
  requiredTeam2RatioInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateRequiredOdds();
    }
  });
  
  function calculateRequiredOdds() {
    // Get inputs
    const team1Ratio = parseFloat(requiredTeam1RatioInput.value);
    const team1Bet = parseFloat(requiredTeam1BetInput.value);
    const team2Bet = parseFloat(requiredTeam2BetInput.value);
    const team2Ratio = parseFloat(requiredTeam2RatioInput.value);
    
    // Validate inputs
    if (isNaN(team1Ratio) || team1Ratio <= 1) {
      alert('Please enter a valid Team 1 odds ratio greater than 1.00');
      return;
    }
    
    if (isNaN(team2Ratio) || team2Ratio <= 1) {
      alert('Please enter a valid Team 2 odds ratio greater than 1.00');
      return;
    }
    
    if (isNaN(team1Bet) || team1Bet <= 0) {
      alert('Please enter a valid Team 1 bet amount greater than 0');
      return;
    }
    
    if (isNaN(team2Bet) || team2Bet <= 0) {
      alert('Please enter a valid Team 2 bet amount greater than 0');
      return;
    }
    
    // Calculate total investment and potential winnings
    const totalBet = team1Bet + team2Bet;
    const team1Winnings = team1Bet * team1Ratio;
    const team2Winnings = team2Bet * team2Ratio;
    
    // Calculate profit for each scenario
    const profitIfTeam1Wins = team1Winnings - totalBet;
    const profitIfTeam2Wins = team2Winnings - totalBet;
    
    // Check if we have a winning scenario for either team
    const hasWinningScenario = profitIfTeam1Wins > 0 || profitIfTeam2Wins > 0;
    
    // If we have a winning scenario, show the best profit
    // Otherwise, show the least bad loss scenario
    const potentialProfit = hasWinningScenario ? 
      Math.max(profitIfTeam1Wins, profitIfTeam2Wins) : 
      Math.max(profitIfTeam1Wins, profitIfTeam2Wins);
    
    const profitPercentage = (potentialProfit / totalBet) * 100;
    
    // Update bet amount display
    requiredBetAmountDisplay.textContent = `(for $${team1Bet.toFixed(2)} on Team 1 and $${team2Bet.toFixed(2)} on Team 2)`;
    
    // Display results
    requiredTotalInvestmentEl.textContent = `$${totalBet.toFixed(2)}`;
    requiredTotalInvestmentEl.className = 'result-value';
    
    // Display profit/loss with appropriate styling
    if (Math.abs(potentialProfit) < 0.0001) { // Allow for tiny rounding errors
      requiredPotentialProfitEl.textContent = '$0.0000';
      requiredPotentialProfitEl.className = 'result-value';
      
      requiredProfitPercentageEl.textContent = '0.0000%';
      requiredProfitPercentageEl.className = 'result-value';
    } else if (potentialProfit > 0) {
      requiredPotentialProfitEl.textContent = `$${potentialProfit.toFixed(4)}`;
      requiredPotentialProfitEl.className = 'result-value positive';
      
      requiredProfitPercentageEl.textContent = `${profitPercentage.toFixed(4)}%`;
      requiredProfitPercentageEl.className = 'result-value positive';
    } else {
      requiredPotentialProfitEl.textContent = `-$${Math.abs(potentialProfit).toFixed(4)}`;
      requiredPotentialProfitEl.className = 'result-value negative';
      
      requiredProfitPercentageEl.textContent = `-${Math.abs(profitPercentage).toFixed(4)}%`;
      requiredProfitPercentageEl.className = 'result-value negative';
    }
    
    // Make the result cards clickable to show detailed information
    const resultCards = document.querySelectorAll('.required-results .result-card');
    resultCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        showRequiredOddsDetails(team1Bet, team2Bet, team1Ratio, team2Ratio);
      });
    });
  }
  
  // Function to show detailed required odds information in modal
  function showRequiredOddsDetails(team1Bet, team2Bet, team1Ratio, team2Ratio) {
    const totalInvestment = team1Bet + team2Bet;
    const team1Winnings = team1Bet * team1Ratio;
    const team2Winnings = team2Bet * team2Ratio;
    
    // Calculate profit for each scenario
    const profitIfTeam1Wins = team1Winnings - totalInvestment;
    const profitIfTeam2Wins = team2Winnings - totalInvestment;
    
    // For perfect arbitrage, both scenarios should yield the same profit
    // Calculate profit percentage based on the average profit
    const averageProfit = (profitIfTeam1Wins + profitIfTeam2Wins) / 2;
    const profitPercentage = (averageProfit / totalInvestment) * 100;
    
    // Update modal content
    modalTeam1Bet.textContent = `$${team1Bet.toFixed(2)}`;
    modalTeam2Bet.textContent = `$${team2Bet.toFixed(2)}`;
    modalTotalInvestment.textContent = `$${totalInvestment.toFixed(2)}`;
    
    // Create a combined text for potential winnings showing both scenarios
    modalPotentialWinnings.innerHTML = 
      `If Team 1 wins: $${team1Winnings.toFixed(4)}<br>` +
      `If Team 2 wins: $${team2Winnings.toFixed(4)}`;
    
    // Set profit/loss with appropriate styling - each scenario gets its own color
    let team1ProfitClass = profitIfTeam1Wins >= 0 ? 'positive' : 'negative';
    let team2ProfitClass = profitIfTeam2Wins >= 0 ? 'positive' : 'negative';
    
    let profitText = '';
    
    if (profitIfTeam1Wins >= 0) {
      profitText += `If Team 1 wins: <span class="${team1ProfitClass}">$${profitIfTeam1Wins.toFixed(4)}</span><br>`;
    } else {
      profitText += `If Team 1 wins: <span class="${team1ProfitClass}">-$${Math.abs(profitIfTeam1Wins).toFixed(4)}</span><br>`;
    }
    
    if (profitIfTeam2Wins >= 0) {
      profitText += `If Team 2 wins: <span class="${team2ProfitClass}">$${profitIfTeam2Wins.toFixed(4)}</span>`;
    } else {
      profitText += `If Team 2 wins: <span class="${team2ProfitClass}">-$${Math.abs(profitIfTeam2Wins).toFixed(4)}</span>`;
    }
    
    modalProfitAmount.innerHTML = profitText;
    modalProfitAmount.className = 'modal-detail-value';
    
    modalProfitPercentage.textContent = `${profitPercentage.toFixed(2)}%`;
    modalProfitPercentage.className = profitPercentage >= 0 ? 
                                    'modal-detail-value positive' : 
                                    'modal-detail-value negative';
    
    // Show the modal
    modal.style.display = 'flex';
  }
  
  // Initialize with default values
  betAmountInput.value = '100';
  payoutBetAmountInput.value = '100';
});
