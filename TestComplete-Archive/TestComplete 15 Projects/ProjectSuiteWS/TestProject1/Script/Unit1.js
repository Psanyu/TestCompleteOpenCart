function TestGetCustomer()
{
    var service = WebServices.WebService1;

    Log.Message("Service object loaded");

    var credentials = service.Credentials;

    Log.Message("Credentials object loaded");

    var result = service.GetCustomer("1001");

    Log.Message("SOAP Result = " + result);
}

function TestGetCustomer2()
{
    var service = WebServices.WebService1;

    service.GetCustomer("1001");

    Log.Message("SOAP call completed");

    Log.Message(
        "Last Response = " +
        service.LastResponse
    );
}

function TestGetCustomer3()
{
    var service = WebServices.WebService1;

    service.GetCustomer("1001");

    Log.Message("SOAP call completed");

    var response = service.LastResponse;

    Log.Message("Response XML = " + response.xml);
}

function TestGetCustomer4()
{
    var service = WebServices.WebService1;

    // Call SOAP service
    service.GetCustomer("1001");

    // Get SOAP response
    var response = service.LastResponse;

    Log.Message("SOAP call completed");

    // Find the result element using XPath.
    // local-name() avoids problems with the tns namespace prefix.
    var resultNode =
        response.selectSingleNode("//*[local-name()='result']");

    if (resultNode != null)
    {
        var result = resultNode.text;

        Log.Message("SOAP Result = " + result);
    }
    else
    {
        Log.Error("Result element was not found");

        Log.Message(
            "Response XML = " + response.xml
        );
    }
}

function TestGetCustomer5()
{
    var service = WebServices.WebService1;

    // Call SOAP service
    service.GetCustomer("1001");

    // Get SOAP response
    var response = service.LastResponse;

    // Extract result
    var resultNode =
        response.selectSingleNode("//*[local-name()='result']");

    if (resultNode == null)
    {
        Log.Error("Result element was not found");
        return;
    }

    var actualResult = resultNode.text;
    var expectedResult = "1001|John Smith|john@example.com";

    // Validate response
    if (actualResult == expectedResult)
    {
        Log.Checkpoint(
            "PASS - Customer data is correct: " +
            actualResult
        );
    }
    else
    {
        Log.Error(
            "FAIL - Expected: " + expectedResult +
            " | Actual: " + actualResult
        );
    }
}