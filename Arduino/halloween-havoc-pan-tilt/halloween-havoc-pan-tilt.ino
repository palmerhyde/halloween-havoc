#include <Servo.h>

Servo panServo;
Servo tiltServo;
const int TILT_OUTPUT_PIN = 2; // D4
const int TILT_SPEED = 25;
const int TILT_START_ANGLE = 0;
const int TILT_END_ANGLE= 70;
const int TILT_CENTER_ANGLE = 35;
const int PAN_OUTPUT_PIN = 14; // D5
const int PAN_SPEED = 30;
const int PAN_START_ANGLE = 0;
const int PAN_END_ANGLE= 180;
const int PAN_CENTER_ANGLE = 0;
const int BAUD_RATE = 115200;


void setup() {
  Serial.begin(BAUD_RATE);
  //tiltServo.attach(TILT_OUTPUT_PIN);
  panServo.attach(PAN_OUTPUT_PIN);
  //tiltServo.write(TILT_CENTER_ANGLE);
  panServo.write(80);
}

void loop() {
  // basicTiltRoutine();
  // basicPanRoutine();
   delay(1000);  
}

void basicTiltRoutine() {
    for (int tilt = TILT_CENTER_ANGLE; tilt <= TILT_END_ANGLE; tilt += 1) { 
      tiltServo.write(tilt);              
      delay(TILT_SPEED);                   
  }

  delay(1000);  
  
  for (int tilt = TILT_END_ANGLE; tilt >= TILT_START_ANGLE; tilt -= 1) {
    tiltServo.write(tilt);             
    delay(TILT_SPEED);                      
  }

  for (int tilt = TILT_START_ANGLE; tilt <= TILT_CENTER_ANGLE; tilt += 1) {
    tiltServo.write(tilt);             
    delay(TILT_SPEED);                      
  }
 
  delay(5000);
}

void basicPanRoutine() {
    for (int tilt = TILT_CENTER_ANGLE; tilt <= TILT_END_ANGLE; tilt += 1) { 
      //panServo.write(tilt);              
      //delay(TILT_SPEED);                   
  }

  delay(1000);  
  
  for (int tilt = TILT_END_ANGLE; tilt >= TILT_START_ANGLE; tilt -= 1) {
    //panServo.write(tilt);             
    //delay(TILT_SPEED);                      
  }

  for (int tilt = TILT_START_ANGLE; tilt <= TILT_CENTER_ANGLE; tilt += 1) {
    //panServo.write(tilt);             
    //delay(TILT_SPEED);                      
  }
 
  //delay(5000);
}

