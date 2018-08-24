const int BAUD_RATE = 115200;
const int ANALOG_INPUT_1 = A0;
const int RED_LED_OUTPUT = 5;
const int GREEN_LED_OUTPUT = 4;
const int BLUE_LED_OUTPUT = 0;

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
}

void loop() {
   if (millis() > prevMillis + 32) {
    listenToMic();
   }
}

void listenToMic() {
  int volume = analogRead(ANALOG_INPUT_1);

  if (volume < VOLUME_THRESHOLD) {
    // turn LED on:
    digitalWrite(LED_BUILTIN, 0);
    setColour(255, 0, 0);
  } else {
    // turn LED off:
    digitalWrite(LED_BUILTIN, 255);
    setColour(0, 0, 0);
  }

  delay(DELAY);                      
  Serial.println(volume);
}

void setColour(unsigned int r, unsigned int g, unsigned int b) {
  analogWriteRange(255);
  analogWrite(RED_LED_OUTPUT, 255 - r);
  analogWriteRange(255);
  analogWrite(GREEN_LED_OUTPUT, 255 - g);
  analogWriteRange(255);
  analogWrite(BLUE_LED_OUTPUT, 255 - b);
}










