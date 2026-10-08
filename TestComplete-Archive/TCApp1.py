import tkinter as tk
from tkinter import ttk, messagebox

class MiniExcelApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Mini Excel - TestComplete Practice")
        self.root.geometry("1050x620")
        self.root.minsize(950, 560)

        self.employee_var = tk.StringVar()
        self.department_var = tk.StringVar(value="IT")
        self.expense_var = tk.StringVar()
        self.amount_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Pending")
        self.search_var = tk.StringVar()
        self.total_var = tk.StringVar(value="$0.00")

        self.build_ui()
        self.load_sample_data()

    def build_ui(self):
        header = ttk.Frame(self.root, padding=12)
        header.pack(fill="x")

        ttk.Label(header, text="Mini Excel", font=("Segoe UI", 20, "bold")).pack(side="left")
        ttk.Label(header, text="  Employee Expense Tracker", font=("Segoe UI", 11)).pack(side="left", pady=(8,0))

        form = ttk.LabelFrame(self.root, text="Expense Entry", padding=12)
        form.pack(fill="x", padx=12, pady=5)

        labels = ["Employee", "Department", "Expense", "Amount", "Status"]
        for i, text in enumerate(labels):
            ttk.Label(form, text=text).grid(row=0, column=i, sticky="w", padx=5)

        self.employee_entry = ttk.Entry(form, textvariable=self.employee_var, width=22)
        self.employee_entry.grid(row=1, column=0, padx=5, pady=5)

        self.department_combo = ttk.Combobox(
            form, textvariable=self.department_var,
            values=["IT", "HR", "Finance", "Sales", "Operations"],
            state="readonly", width=16
        )
        self.department_combo.grid(row=1, column=1, padx=5, pady=5)

        self.expense_entry = ttk.Entry(form, textvariable=self.expense_var, width=22)
        self.expense_entry.grid(row=1, column=2, padx=5, pady=5)

        self.amount_entry = ttk.Entry(form, textvariable=self.amount_var, width=15)
        self.amount_entry.grid(row=1, column=3, padx=5, pady=5)

        self.status_combo = ttk.Combobox(
            form, textvariable=self.status_var,
            values=["Pending", "Approved", "Rejected"],
            state="readonly", width=14
        )
        self.status_combo.grid(row=1, column=4, padx=5, pady=5)

        buttons = ttk.Frame(form)
        buttons.grid(row=1, column=5, padx=10)
        self.add_button = ttk.Button(buttons, text="Add", command=self.add_record)
        self.add_button.pack(side="left", padx=3)
        self.update_button = ttk.Button(buttons, text="Update", command=self.update_record)
        self.update_button.pack(side="left", padx=3)
        self.delete_button = ttk.Button(buttons, text="Delete", command=self.delete_record)
        self.delete_button.pack(side="left", padx=3)
        self.clear_button = ttk.Button(buttons, text="Clear", command=self.clear_form)
        self.clear_button.pack(side="left", padx=3)

        search_frame = ttk.Frame(self.root, padding=(12, 8, 12, 4))
        search_frame.pack(fill="x")
        ttk.Label(search_frame, text="Search:").pack(side="left")
        self.search_entry = ttk.Entry(search_frame, textvariable=self.search_var, width=30)
        self.search_entry.pack(side="left", padx=6)
        self.search_button = ttk.Button(search_frame, text="Search", command=self.search_records)
        self.search_button.pack(side="left")
        self.show_all_button = ttk.Button(search_frame, text="Show All", command=self.show_all)
        self.show_all_button.pack(side="left", padx=5)

        grid_frame = ttk.Frame(self.root, padding=12)
        grid_frame.pack(fill="both", expand=True)

        columns = ("Employee", "Department", "Expense", "Amount", "Status")
        self.tree = ttk.Treeview(grid_frame, columns=columns, show="headings", height=14)
        widths = {"Employee": 210, "Department": 130, "Expense": 220, "Amount": 110, "Status": 120}
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=widths[col], anchor="w")
        self.tree.column("Amount", anchor="e")
        self.tree.column("Status", anchor="center")

        scrollbar = ttk.Scrollbar(grid_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        self.tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        self.tree.bind("<<TreeviewSelect>>", self.on_row_select)

        footer = ttk.Frame(self.root, padding=12)
        footer.pack(fill="x")
        ttk.Label(footer, text="Total Approved/Pending Amount:").pack(side="left")
        ttk.Label(footer, textvariable=self.total_var, font=("Segoe UI", 12, "bold")).pack(side="left", padx=8)
        self.save_button = ttk.Button(footer, text="Save", command=self.save_data)
        self.save_button.pack(side="right", padx=4)
        self.reset_button = ttk.Button(footer, text="Reset Sample Data", command=self.reset_data)
        self.reset_button.pack(side="right", padx=4)

        self.message_label = ttk.Label(self.root, text="Ready", padding=(12, 0, 12, 8))
        self.message_label.pack(fill="x")

    def load_sample_data(self):
        records = [
            ("John Smith", "IT", "Laptop", "1200.00", "Approved"),
            ("Mary Jones", "HR", "Training", "500.00", "Pending"),
            ("David Lee", "Finance", "Software", "850.00", "Approved"),
        ]
        for r in records:
            self.tree.insert("", "end", values=r)
        self.update_total()

    def add_record(self):
        employee = self.employee_var.get().strip()
        department = self.department_var.get().strip()
        expense = self.expense_var.get().strip()
        amount = self.amount_var.get().strip()
        status = self.status_var.get().strip()

        if not employee or not expense or not amount:
            self.show_error("Employee, Expense and Amount are required.")
            return
        try:
            value = float(amount)
            if value < 0:
                raise ValueError
        except ValueError:
            self.show_error("Amount must be a valid non-negative number.")
            return

        self.tree.insert("", "end", values=(employee, department, expense, f"{value:.2f}", status))
        self.clear_form()
        self.message_label.config(text="Record added successfully.")
        self.update_total()

    def update_record(self):
        selected = self.tree.selection()
        if not selected:
            self.show_error("Select a row before clicking Update.")
            return
        try:
            value = float(self.amount_var.get())
            if value < 0:
                raise ValueError
        except ValueError:
            self.show_error("Amount must be a valid non-negative number.")
            return
        values = (
            self.employee_var.get().strip(),
            self.department_var.get().strip(),
            self.expense_var.get().strip(),
            f"{value:.2f}",
            self.status_var.get().strip()
        )
        if not values[0] or not values[2]:
            self.show_error("Employee and Expense are required.")
            return
        self.tree.item(selected[0], values=values)
        self.message_label.config(text="Record updated successfully.")
        self.update_total()

    def delete_record(self):
        selected = self.tree.selection()
        if not selected:
            self.show_error("Select a row before clicking Delete.")
            return
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete the selected record?"):
            self.tree.delete(selected[0])
            self.clear_form()
            self.message_label.config(text="Record deleted successfully.")
            self.update_total()

    def clear_form(self):
        self.employee_var.set("")
        self.department_var.set("IT")
        self.expense_var.set("")
        self.amount_var.set("")
        self.status_var.set("Pending")
        self.tree.selection_remove(self.tree.selection())

    def on_row_select(self, _event=None):
        selected = self.tree.selection()
        if not selected:
            return
        values = self.tree.item(selected[0], "values")
        self.employee_var.set(values[0])
        self.department_var.set(values[1])
        self.expense_var.set(values[2])
        self.amount_var.set(values[3])
        self.status_var.set(values[4])

    def search_records(self):
        term = self.search_var.get().strip().lower()
        if not term:
            self.show_all()
            return
        for item in self.tree.get_children():
            values = self.tree.item(item, "values")
            visible = any(term in str(v).lower() for v in values)
            if visible:
                self.tree.reattach(item, "", "end")
            else:
                self.tree.detach(item)
        self.message_label.config(text=f"Search completed for: {self.search_var.get()}")

    def show_all(self):
        for item in self.tree.get_children():
            self.tree.reattach(item, "", "end")
        self.message_label.config(text="Showing all records.")

    def update_total(self):
        total = 0.0
        for item in self.tree.get_children():
            values = self.tree.item(item, "values")
            try:
                total += float(values[3])
            except (ValueError, IndexError):
                pass
        self.total_var.set(f"${total:,.2f}")

    def save_data(self):
        messagebox.showinfo("Save", "Data saved successfully.")
        self.message_label.config(text="Save completed successfully.")

    def reset_data(self):
        if messagebox.askyesno("Reset Data", "Reset the grid to the sample data?"):
            for item in self.tree.get_children():
                self.tree.delete(item)
            self.load_sample_data()
            self.clear_form()
            self.message_label.config(text="Sample data restored.")

    def show_error(self, message):
        messagebox.showerror("Validation Error", message)
        self.message_label.config(text=message)

if __name__ == "__main__":
    root = tk.Tk()
    app = MiniExcelApp(root)
    root.mainloop()
