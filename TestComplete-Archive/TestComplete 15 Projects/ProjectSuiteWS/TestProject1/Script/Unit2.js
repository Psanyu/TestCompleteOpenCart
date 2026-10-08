function TestAdd()
{
    var service = WebServices.WebService2;

    // Call Add
    service.Add(10, 5);

    // Get SOAP response
    var response = service.LastResponse;

    // Extract <result>
    var resultNode =
        response.selectSingleNode("//*[local-name()='result']");

    if (resultNode == null)
    {
        Log.Error("Result element was not found");
        return;
    }

    var actual = resultNode.text;
    var expected = "15";

    if (actual == expected)
    {
        Log.Checkpoint(
            "PASS - Add result is correct: " + actual
        );
    }
    else
    {
        Log.Error(
            "FAIL - Expected: " + expected +
            " | Actual: " + actual
        );
    }
}