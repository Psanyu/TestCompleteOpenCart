function testUserForms()
{
  if (UserForms.UserForm1.ShowModal() == mrOk)
  {
    Log.Message("Username entered successfully");
    Log.Message("Password entered successfully (value hidden)");
  }
  else
  {
    Log.Message("error");
  }
}