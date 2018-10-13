#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Servo.h>

// Serial set up for debug
const int BAUD_RATE = 115200;

// Analog input for mic
const int ANALOG_INPUT_1 = A0; //ADC0

// RGB LED Pins
const int RED_LED_OUTPUT = 5; // D1
const int GREEN_LED_OUTPUT = 4; // D2
const int BLUE_LED_OUTPUT = 0; // D3

// Servo for Pan
Servo panServo;
const int PAN_OUTPUT_PIN = 14; // D5

// Wifi
// TODO: Automate setting these
const char* ssid = "SlimerLuvMomiz";
const char* PASSWORD = "5111151111";

// TODO: get from config
const char* DNS = "powerslave";

ESP8266WebServer server(80);

int VOLUME_THRESHOLD = 800;
int DELAY = 30;
int red = 0;
int green = 0;
int blue = 0;
const int PAN_SPEED = 30;
const int PAN_START_ANGLE = 80;
const int PAN_END_ANGLE= 160;
const int PAN_CENTER_ANGLE = 120;
bool PAN = true;

unsigned long previousMicMillis = millis();
unsigned long previousPanMillis = millis();

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
  blue = 128;
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

   unsigned long currentMillis = millis();

   if (currentMillis > previousMicMillis + 70) {
    previousMicMillis = currentMillis; 
    listenToMic();
   }
   
   if (currentMillis() > previousPanMillis + 10000 && PAN) {
    basicPanRoutine();
   }
}

void listenToMic() {
  //loopBlue();
  int volume = analogRead(ANALOG_INPUT_1);

  if (volume > VOLUME_THRESHOLD) {
    // turn LED on:
    digitalWrite(LED_BUILTIN, 0);
    setColour(red, green, blue);
  } else {
    // turn LED off:
    digitalWrite(LED_BUILTIN, 255);
    setColour(0, 0, 0);
  }

  // Need mic delay. Really want it to be beats PM calculation
  //delay(DELAY);                      
  //Serial.println(volume);
}

void startWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, PASSWORD);
    // Wait for connection
  Serial.print("Attempting to connect to ");
  Serial.println(ssid);
  Serial.println(WiFi.status());

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
    //delay(20);
  }
}

void loopGreen() {
  for (int i=0; i <=255; i++) {
    setColour(0, i, 0);
    //delay(20);
  }
}

void loopBlue() {
  for (int i=0; i <=255; i++) {
    setColour(0, 0, i);
    //delay(20);
  }
}

void basicPanRoutine() {
    panServo.attach(PAN_OUTPUT_PIN);
    
  
    for (int pan = PAN_CENTER_ANGLE; pan <= PAN_END_ANGLE; pan += 1) { 
      panServo.write(pan);              
      //delay(PAN_SPEED);                   
  }

  //delay(1000);  
  
  for (int pan = PAN_END_ANGLE; pan >= PAN_START_ANGLE; pan -= 1) {
    panServo.write(pan);             
    //delay(PAN_SPEED);                      
  }

  for (int pan = PAN_START_ANGLE; pan <= PAN_CENTER_ANGLE; pan += 1) {
    panServo.write(pan);             
    //delay(PAN_SPEED);                      
  }

  panServo.detach(PAN_OUTPUT_PIN);
 
  //delay(5000);
}

void handleRoot() {
  // TODO: make this pretty. Include status.
  String message = "hello from ";
  message += DNS;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", message);
}

void handleSetColour() {
  red = server.arg("r").toInt();
  green = server.arg("g").toInt();
  blue = server.arg("b").toInt();
  int pan = server.arg("p").toInt();
  setColour(red, green, blue);

  if (pan == 1) {
    PAN = true;
  }
  else {
    PAN = false;
  }

  Serial.println("Colour set to:\n");
  Serial.println("Red:");
  Serial.println(red);
  Serial.println("\nGreen:");
  Serial.println(green);
  Serial.println("\nBlue:");
  Serial.println(blue);
  Serial.println("\nPan:");
  Serial.println(pan);
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(204);
}

void handleNotFound(){
  String message = "File Not Found";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(404, "text/plain", message);
}

class Sweeper {
  Servo servo;
  int position;
  int increment;
  int updateInterval;
  unsigned long lastUpdate
  const int PAN_SPEED = 30;
  const int PAN_START_ANGLE = 80;
  const int PAN_END_ANGLE= 160;
  const int PAN_CENTER_ANGLE = 120;

  public: 
  Sweeper(int interval)
  {
    updateInterval = interval;
    increment = 1;
  }
  
  void Attach(int pin)
  {
    servo.attach(pin);
  }
  
  void Detach()
  {
    servo.detach();
  }
  
  void Update()
  {
    if((millis() - lastUpdate) > updateInterval)  // time to update
    {
      lastUpdate = millis();
      pos += increment;
      servo.write(pos);
      
      
      if ((pos >= PAN_END_ANGLE) || (pos <= PAN_START_ANGLE)) // end of sweep
      {
        // reverse direction
        increment = -increment;
      }
    }
  }
}

