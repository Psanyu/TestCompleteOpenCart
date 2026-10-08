 function login()
 { 
  var page;
  var links;
  var images;
  
  Browsers.Item(btChrome).Navigate("http://localhost/opencart/");

  let browser = Aliases.browser;
  Homepage = browser.Page("*");
  Homepage.Wait();

  let Homepgdoc = Homepage.contentDocument;
  elements = Homepgdoc.all;

  
  browser.BrowserWindow2.Maximize();
  Homepage.Wait();
  
  for (let i = 0; i < elements.length; i++)
  {
  if (elements.item(i).innerText == "My Account")
  {
    let linkMyAccount = elements.item(i);
    linkMyAccount.click();
    break;
  }
  }

  Homepage.Wait();

  // Get DOM again after opening My Account
  Homepgdoc = Homepage.contentDocument;
  let linksi = Homepgdoc.links;

  for (let j = 0; j < linksi.length; j++)
  {
  if (linksi.item(j).innerText == "Login")
   {
    let linkLogin = linksi.item(j);
    linkLogin.click();
    break;
   }
  }
  
   let loginpage = browser.Page("*");
   loginpage.Wait();

   let doclogin = loginpage.contentDocument;
   loginpage.Wait();

   // Find email/password in DOM
    let RetCustform = loginpage.FindElement("#form-login");
    let email = RetCustform.FindElement("input[type='email']");
    let password = RetCustform.FindElement("input[type='password']");
    let loginButton = RetCustform.FindElement("button.btn.btn-primary");
 
    if (email == null)
    {
     Log.Error("input-email NOT FOUND");
     return;
    }

    else
    {
      email.Click();
      email.Keys(Project.Variables.Email);
    }
    
    
    if (password == null)
    {
     Log.Error("input-password NOT FOUND");
     return;
    }
    else
    {
      password.Click();
      password.Keys(Project.Variables.Pwd);
    }
    
    let buttons = doclogin.getElementsByTagName("button");

    for (let k = 0; k < buttons.length; k++)
    {
      if (buttons.item(k).innerText.trim() == "Login")
      {
        buttons.item(k).click();
        break;
      }
    }

    let myAccountpage = browser.Page("*");
    myAccountpage.Wait();
   
    myAccountpage.Close();
  
  }