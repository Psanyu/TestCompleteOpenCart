function Test1()
{
  var page;
  var links;
  var images;
  
  Browsers.Item(btChrome).Navigate("http://localhost/opencart/");

  let browser = Aliases.browser;
  page = browser.Page("*");
  page.Wait();

  let doc = page.contentDocument;
  links = doc.all;
  images = doc.images;

  for (let i = 0; i < links.length; i++)
  {
    Log.Message(links.item(i).OuterHtml);
  }
  
  for (let i = 0; i < images.length; i++)
  {
    Log.Message(images.item(i).OuterHtml);
  }
  
}

