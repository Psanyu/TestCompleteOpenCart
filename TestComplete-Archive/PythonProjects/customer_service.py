from http.server import BaseHTTPRequestHandler, HTTPServer
import xml.etree.ElementTree as ET


# ============================================================
# SERVER CONFIGURATION
# ============================================================

HOST = "localhost"
PORT = 8090


# ============================================================
# TEST DATA
# ============================================================

CUSTOMERS = {
    "1001": {
        "name": "John Smith",
        "email": "john@example.com"
    },
    "1002": {
        "name": "Sarah Jones",
        "email": "sarah@example.com"
    }
}


# ============================================================
# SOAP REQUEST HANDLER
# ============================================================

class SOAPHandler(BaseHTTPRequestHandler):

    # --------------------------------------------------------
    # GET - Return WSDL
    # --------------------------------------------------------

    def do_GET(self):

        if self.path.lower().startswith("/?wsdl"):

            wsdl = self.get_wsdl()

            self.send_response(200)
            self.send_header(
                "Content-Type",
                "text/xml; charset=utf-8"
            )
            self.end_headers()

            self.wfile.write(
                wsdl.encode("utf-8")
            )

        else:

            self.send_response(404)
            self.end_headers()


    # --------------------------------------------------------
    # POST - Process SOAP request
    # --------------------------------------------------------

    def do_POST(self):

        try:

            # Read request body
            length = int(
                self.headers.get("Content-Length", 0)
            )

            request_data = self.rfile.read(length)


            print("\n=================================")
            print("SOAP REQUEST RECEIVED")
            print("=================================")

            print(
                request_data.decode(
                    "utf-8",
                    errors="replace"
                )
            )


            # ------------------------------------------------
            # Parse SOAP XML
            # ------------------------------------------------

            root = ET.fromstring(request_data)

            customer_id = None


            # Find customerId regardless of XML namespace
            for element in root.iter():

                if element.tag.endswith("customerId"):

                    customer_id = element.text

                    if customer_id is not None:
                        customer_id = customer_id.strip()

                    break


            print("\nCustomer ID:", customer_id)


            # ------------------------------------------------
            # Validate customerId
            # ------------------------------------------------

            if not customer_id:

                self.send_soap_fault(
                    "Customer ID is required"
                )

                return


            # ------------------------------------------------
            # Customer found
            # ------------------------------------------------

            if customer_id in CUSTOMERS:

                customer = CUSTOMERS[customer_id]

                result = (
                    f"{customer_id}|"
                    f"{customer['name']}|"
                    f"{customer['email']}"
                )


                response = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tns="http://example.com/customer">

    <soap:Body>

        <tns:GetCustomerResponse>
            <tns:result>{result}</tns:result>
        </tns:GetCustomerResponse>

    </soap:Body>

</soap:Envelope>"""


                self.send_response(200)

                self.send_header(
                    "Content-Type",
                    "text/xml; charset=utf-8"
                )

                self.end_headers()


                print("\n=================================")
                print("SOAP RESPONSE SENT")
                print("=================================")

                print(response)


                self.wfile.write(
                    response.encode("utf-8")
                )


            # ------------------------------------------------
            # Customer NOT found
            # ------------------------------------------------

            else:

                self.send_soap_fault(
                    "Customer not found"
                )


        # ----------------------------------------------------
        # Unexpected server error
        # ----------------------------------------------------

        except Exception as e:

            print("\nSERVER ERROR:")
            print(e)

            self.send_soap_fault(
                "Internal server error"
            )


    # --------------------------------------------------------
    # SOAP FAULT
    # --------------------------------------------------------

    def send_soap_fault(self, message):

        response = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">

    <soap:Body>

        <soap:Fault>

            <faultcode>soap:Client</faultcode>

            <faultstring>{message}</faultstring>

        </soap:Fault>

    </soap:Body>

</soap:Envelope>"""


        self.send_response(500)

        self.send_header(
            "Content-Type",
            "text/xml; charset=utf-8"
        )

        self.end_headers()


        print("\n=================================")
        print("SOAP FAULT SENT")
        print("=================================")

        print(response)


        self.wfile.write(
            response.encode("utf-8")
        )


    # --------------------------------------------------------
    # WSDL
    # --------------------------------------------------------

    def get_wsdl(self):

        return f"""<?xml version="1.0" encoding="utf-8"?>

<definitions

    xmlns="http://schemas.xmlsoap.org/wsdl/"

    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"

    xmlns:tns="http://example.com/customer"

    xmlns:xsd="http://www.w3.org/2001/XMLSchema"

    targetNamespace="http://example.com/customer">


    <!-- REQUEST -->

    <message name="GetCustomerRequest">

        <part
            name="customerId"
            type="xsd:string"/>

    </message>


    <!-- RESPONSE -->

    <message name="GetCustomerResponse">

        <part
            name="result"
            type="xsd:string"/>

    </message>


    <!-- PORT TYPE -->

    <portType name="CustomerServicePortType">

        <operation name="GetCustomer">

            <input
                message="tns:GetCustomerRequest"/>

            <output
                message="tns:GetCustomerResponse"/>

        </operation>

    </portType>


    <!-- SOAP BINDING -->

    <binding
        name="CustomerServiceBinding"
        type="tns:CustomerServicePortType">


        <soap:binding
            style="rpc"
            transport="http://schemas.xmlsoap.org/soap/http"/>


        <operation name="GetCustomer">


            <soap:operation
                soapAction="GetCustomer"/>


            <input>

                <soap:body
                    use="literal"
                    namespace="http://example.com/customer"/>

            </input>


            <output>

                <soap:body
                    use="literal"
                    namespace="http://example.com/customer"/>

            </output>


        </operation>

    </binding>


    <!-- SERVICE -->

    <service name="CustomerService">


        <port
            name="CustomerServicePort"
            binding="tns:CustomerServiceBinding">


            <soap:address
                location="http://localhost:{PORT}/"/>


        </port>


    </service>


</definitions>"""


# ============================================================
# START SERVER
# ============================================================

server = HTTPServer(
    (HOST, PORT),
    SOAPHandler
)


print("=================================")
print(" SOAP Customer Service Running")
print("=================================")

print(
    f"Endpoint: http://localhost:{PORT}/"
)

print(
    f"WSDL:     http://localhost:{PORT}/?wsdl"
)

print("")
print("Available Customers:")
print("1001 - John Smith")
print("1002 - Sarah Jones")
print("")
print("Press Ctrl+C to stop")


# Keep server running
server.serve_forever()