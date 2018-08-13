#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const int BAUD_RATE = 115200;
const int ANALOG_INPUT_1 = A0;
const int RED_LED_OUTPUT = 5;
const int GREEN_LED_OUTPUT = 4;
const int BLUE_LED_OUTPUT = 0;
const char* ssid = "SlimerLuvMomiz";
const char* PASSWORD = "5111151111";
const char* DNS = "powerslave";

ESP8266WebServer server(80);

int VOLUME_THRESHOLD = 511;
int DELAY = 30;
int red = 0;
int green = 0;
int blue = 0;

unsigned long prevMillis = millis();

void setup() {
  Serial.begin(BAUD_RATE);
  pinMode(ANALOG_INPUT_1, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(RED_LED_OUTPUT, OUTPUT);
  pinMode(GREEN_LED_OUTPUT, OUTPUT);
  pinMode(BLUE_LED_OUTPUT, OUTPUT);
  setColour(0, 0, 0);
  red = 128;
  green = 128;
  blue = 0;
  setColour(red, green, blue);
  startWifi();
  startHttpServer();
}

void loop() {
  server.handleClient();
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("not connected.");
    Serial.println(WiFi.status());
   }

   if (millis() > prevMillis + 32) {
    listenToMic();
   }
}

void listenToMic() {
  //loopBlue();
  int volume = analogRead(ANALOG_INPUT_1);

  if (volume < VOLUME_THRESHOLD) {
    // turn LED on:
    digitalWrite(LED_BUILTIN, 0);
    setColour(red, green, blue);
  } else {
    // turn LED off:
    digitalWrite(LED_BUILTIN, 255);
    setColour(0, 0, 0);
  }

  delay(DELAY);                      
  Serial.println(volume);
}

void startWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, PASSWORD);
    // Wait for connection
  Serial.print("Attempting to connect to ");
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    Serial.println(WiFi.status());
    if (WiFi.status() == WL_NO_SSID_AVAIL) {
      Serial.println("ssid cannot be reached");
    }
  }
  
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin(DNS)) {
    Serial.print("MDNS responder started: ");
    Serial.print(DNS); 
    Serial.println(".local");
  }
}

void startHttpServer() {
  server.on("/", handleRoot);
  server.on("/setcolour", handleSetColour);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void setColour(unsigned int r, unsigned int g, unsigned int b) {
  analogWriteRange(255);
  analogWrite(RED_LED_OUTPUT, 255 - r);
  analogWriteRange(255);
  analogWrite(GREEN_LED_OUTPUT, 255 - g);
  analogWriteRange(255);
  analogWrite(BLUE_LED_OUTPUT, 255 - b);
}

void loopRed() {
  for (int i=0; i <=255; i++) {
    setColour(i, 0, 0);
    delay(20);
  }
}

void loopGreen() {
  for (int i=0; i <=255; i++) {
    setColour(0, i, 0);
    delay(20);
  }
}

void loopBlue() {
  for (int i=0; i <=255; i++) {
    setColour(0, 0, i);
    delay(20);
  }
}

void handleRoot() {
  String message = "hello from ";
  message += DNS;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", message);
}

void handleSetColour() {
  red = server.arg("r").toInt();
  green = server.arg("g").toInt();
  blue = server.arg("b").toInt();
  setColour(red, green, blue);
  String message = "{\"red\":"; 
  message += red;
  message += ",\"green\":";
  message += green;
  message += ",\"blue\":";
  message += blue; 
  message += "}";

  server.sendHeader("access-control-allow-credentials", "false");
  server.sendHeader("access-control-allow-headers", "x-requested-with");
  server.sendHeader("access-control-allow-methods", "GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(204);
}

void handleNotFound(){
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET)?"GET":"POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i=0; i<server.args(); i++){
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  message += server.arg("r");
  message += "\n";
  
  server.send(404, "text/plain", message);
}

