 function logout()
 { 
  var page;
  var links;
  var images;
  
  Browsers.Item(btChrome).Navigate("http://localhost/opencart/");

  let browser = Aliases.browser;
  myAccountpage = browser.Page("*");
  myAccountpage.Wait();

  let docmyAccount = myAccountpage.contentDocument;
  elementsmyAccount = docmyAccount.all;

  let myAccountlink = myAccountpage.FindElement("//span[normalize-space()='My Account']");
  myAccountlink.Click();
  
  let logoutLink = myAccountpage.FindElement("//a[normalize-space()='Logout']");
  logoutLink.Click();
  
  myAccountpage.Wait();
  
  let continuelink = myAccountpage.FindElement("//a[normalize-space()='Continue']");
  continuelink.Click();
  
  myAccountpage.Close();
      
  }