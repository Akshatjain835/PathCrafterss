import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Users, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const BudgetSection = ({ budget, setBudget }) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const totalSpent = budget.expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Budgeting</h1>

        {/* ADD EXPENSE */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-3xl hover:bg-sky-800">
              <Plus size={18} />
              Add Expense
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>

            <input
              type="text"
              placeholder="Expense name"
              className="border rounded-md p-2 w-full mt-2"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              className="border rounded-md p-2 w-full mt-2"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />

            <Button
              className="mt-4 w-full bg-sky-600 text-white"
              onClick={() => {
                if (!expenseName || !expenseAmount) return;

                setBudget({
                  ...budget,
                  expenses: [
                    ...budget.expenses,
                    { name: expenseName, amount: Number(expenseAmount) },
                  ],
                });

                setExpenseName("");
                setExpenseAmount("");
                toast.success("Expense added ");
              }}
            >
              Add
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Card */}
      <div className="border rounded-xl p-6 shadow-sm bg-white">
        {/* Top row */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold">₹{totalSpent.toFixed(2)}</h2>

          {/* View Breakdown */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex gap-2">
                <List size={18} />
                View breakdown
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Expense Breakdown</DialogTitle>
              </DialogHeader>

              {budget.expenses.length === 0 ? (
                <p className="text-gray-600">No expenses added yet.</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {budget.expenses.map((e, i) => (
                    <li key={i} className="flex justify-between border-b pb-1">
                      <span>{e.name}</span>
                      <span>₹{e.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {/* SET BUDGET */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full flex gap-2">
                <Pencil size={16} />
                Set budget
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Trip Budget</DialogTitle>
              </DialogHeader>

              <input
                type="number"
                placeholder="Enter total budget"
                className="w-full border rounded-md p-2 mt-2"
                onChange={(e) =>
                  setBudget({
                    ...budget,
                    total: Number(e.target.value),
                  })
                }
              />

              <Button
                onClick={() => toast.success("Budget saved")}
                className="mt-4 w-full bg-sky-600 text-white"
              >
                Save Budget
              </Button>
            </DialogContent>
          </Dialog>

          {/* GROUP BALANCES */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full flex gap-2">
                <Users size={16} />
                Group balances
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Group Balances</DialogTitle>
              </DialogHeader>

              <p className="text-gray-600">
                Total Budget: ₹{budget.total || 0}
              </p>
              <p className="text-gray-600">Spent: ₹{totalSpent}</p>
              <p className="font-medium mt-2">
                Remaining: ₹{budget.total - totalSpent}
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;
