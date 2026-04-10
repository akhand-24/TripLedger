// Debt simplification logic
// Input: Map of userIds to their net balances, e.g., {'userA': -100, 'userB': 50, 'userC': 50}
// Output: Array of simple transactions: [{ from: 'userA', to: 'userB', amount: 50 }, { from: 'userA', to: 'userC', amount: 50 }]

function simplifyDebts(balances) {
  const debtors = []; // People who owe money
  const creditors = []; // People who are owed money

  for (const [userId, balance] of Object.entries(balances)) {
    if (balance < -0.01) debtors.push({ userId, amount: -balance });
    else if (balance > 0.01) creditors.push({ userId, amount: balance });
  }

  // Sort them for a consistent greedy matching (largest debts to largest credits)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0; // index for debtors
  let j = 0; // index for creditors
  const transactions = [];

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const settleAmount = Math.min(debtor.amount, creditor.amount);
    
    if (settleAmount > 0.01) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Number(settleAmount.toFixed(2))
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (Math.abs(debtor.amount) < 0.01) i++;
    if (Math.abs(creditor.amount) < 0.01) j++;
  }

  return transactions;
}

module.exports = simplifyDebts;
