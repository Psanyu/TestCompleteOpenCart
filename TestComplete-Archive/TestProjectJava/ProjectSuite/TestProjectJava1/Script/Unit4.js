function doTheLoop1()
{
  DDT.CSVDriver("C:\\Users\\pandi\\OneDrive\\Desktop\\TestCompleteNApp\\ExpenseEntryData.txt");
  DDT.CurrentDriver.DriveMethod("Unit1.Test1");
}

function Test1()
{
  let desktopWindowXamlSource = Aliases.explorer.wndShell_TrayWnd.DesktopWindowXamlSource;
  desktopWindowXamlSource.Click();
  let python = Aliases.pythonApp;
  let formM = python.MiniExpenseForm.MiniExcel;
  let entryDetails = formM.ExpenseEntrySection;
  let empNm = entryDetails.EmpEdit;
  empNm.Click();
  empNm.Keys("Sam");
  let deptNm = entryDetails.DeptSelect;
  if (deptNm.wText === "HR")
  {
  deptNm.Click();
  }
  let expenseCat = entryDetails.ExpenseEdit;
  expenseCat.Click();
  expenseCat.Keys("OnboardApp");
  let amountVal = entryDetails.AmountEdit;
  amountVal.Click();
  amountVal.Keys("2500");
  let statusNm = entryDetails.StatusSelect
  if (statusNm.wText === "Pending")
  {
    statusNm.Click(); 
  }
  let addButton = entryDetails.ExpenseItemActions.Add;
  addButton.Click();

  //entryDetails.TotalsSection.SaveButton.Click();
  //python.dlgSave.btnOK.ClickButton();
}