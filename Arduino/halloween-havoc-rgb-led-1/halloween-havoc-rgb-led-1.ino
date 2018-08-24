const int RED_LED_OUTPUT = 5;
const int GREEN_LED_OUTPUT = 4;
const int BLUE_LED_OUTPUT = 0;
int DELAY = 1000;

void setup() {
  pinMode(RED_LED_OUTPUT, OUTPUT);
  pinMode(GREEN_LED_OUTPUT, OUTPUT);
  pinMode(BLUE_LED_OUTPUT, OUTPUT);
}

void loop() {
  red();
  //rgb();
  //loopRed();
  //loopGreen();
  //loopBlue();
  //setColour(x, x, x);
}

void red() {
  analogWriteRange(255);
  analogWrite(RED_LED_OUTPUT, 255 - 255);
  delay(DELAY)
  analogWrite(RED_LED_OUTPUT, 255 - 0);
  delay(DELAY)
}

void setColour(unsigned int r, unsigned int g, unsigned int b) {
  analogWriteRange(255);
  analogWrite(RED_LED_OUTPUT, 255 - r);
  analogWriteRange(255);
  analogWrite(GREEN_LED_OUTPUT, 255 - g);
  analogWriteRange(255);
  analogWrite(BLUE_LED_OUTPUT, 255 - b);
}

void rgb() {
  analogWriteRange(255);

  //RED
  setColour(255, 0, 0);
  delay(DELAY)

  //GREEN
  setColour(0, 255, 0);
  delay(DELAY)

  //BLUE
  setColour(0, 0, 255);
  delay(DELAY)
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





