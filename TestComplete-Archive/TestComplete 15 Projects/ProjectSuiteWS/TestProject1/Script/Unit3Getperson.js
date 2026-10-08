function Test_GetPerson()
{
    var service = WebServices.WebService2;

    service.GetPerson("1001");

    var response = service.LastResponse;

    var result =
        response.selectSingleNode("//*[local-name()='result']").text;

    Log.Message(result);
}


function Test_GetPerson2()
{
    WebServices.WebService2.GetPerson("1001");
    XML.GetPerson.Check(WebServices.WebService2);
}
