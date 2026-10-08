function UserRegistration()
{
  var pageUsr;
  var linksUsr;
  var imagesUsr;
  
  Browsers.Item(btChrome).Navigate("http://localhost/opencart/");

  let browser = Aliases.browser;
  Homepage = browser.Page("*");
  Homepage.Wait();

  let doc = Homepage.contentDocument;
  elements = doc.all;
  
  browser.BrowserWindow2.Maximize();
  Homepage.Wait();
  
  for (let y = 0; y < elements.length; y++)
  {
  if (elements.item(y).innerText == "My Account")
  {
    let linkMyAccount = elements.item(y);
    linkMyAccount.click();
    break;
  }
  }

  Homepage.Wait();

  // Get DOM again after opening My Account
  Homepgdoc = Homepage.contentDocument;
  let RegisterLinks = Homepgdoc.links;

  for (let z = 0; z < RegisterLinks.length; z++)
  {
  if (RegisterLinks.item(z).innerText == "Register")
   {
    let linkRegister = RegisterLinks.item(z);
    linkRegister.click();
    break;
   }
  }
  
   let Registerpage = browser.Page("*");
   Registerpage.Wait();

   let docRegister = Registerpage.contentDocument;
   Registerpage.Wait();
   
      // Find email/password in DOM
    let Regform = Registerpage.FindElement("//form[@id='form-register']");
    let fname = Regform.FindElement("#input-firstname");
    let lname = Regform.FindElement("#input-lastname");
    let emailip = Regform.FindElement("#input-email");
    let pwd = Regform.FindElement("#input-password");
    let subscribe = Regform.FindElement("#input-newsletter");
    let privacyPolicy = Regform.FindElement("input[value='1'][name='agree']");
    let continueButton = Regform.FindElement("//button[normalize-space()='Continue']");

    fname.Keys(Project.Variables.FirstName);
    lname.Keys(Project.Variables.LastName);
    emailip.Keys(Project.Variables.Email);
    pwd.Keys(Project.Variables.Pwd);
    subscribe.Click();
    privacyPolicy.Click();
    continueButton.Click();
    
    Registerpage.Wait();
   
    let pageR = browser.Page("*");
    pageR.Wait();
  
    let Continuelink = pageR.FindElement("//a[normalize-space()='Continue']");
    Continuelink.Click();
    
    pageR.Close();
}