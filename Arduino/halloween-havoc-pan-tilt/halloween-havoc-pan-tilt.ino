#include <Servo.h>

// TODO: move class into a separate file
// Managing libaries when developing is a royal pain.
class MonsterServo {
  Servo servo;
  int _position;
  int _increment;
  int _updateInterval;
  unsigned long _lastUpdate;
  int _startAngle;
  int _endAngle;
  int _centreAngle;
  int _centrePauseInterval;
  int _regularPauseInterval;
  int _routine;
  int _pin;
  int _sweepCount;

  public: 
  MonsterServo(int interval, int startAngle, int endAngle, int pin)
  {
    _updateInterval = interval;
    _regularPauseInterval = interval;
    _increment = 1;
    _startAngle = startAngle;
    _endAngle = endAngle;
    _centreAngle = (_endAngle - _startAngle) / 2;
    _position = _centreAngle;
    _centrePauseInterval = 10000;
    _pin = pin;
    _routine = 0;
    _sweepCount = 0;
    Attach(_pin);
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
    if((millis() - _lastUpdate) > _updateInterval)  // time to update
    {
      
      if (_routine == 1 && _updateInterval == _centrePauseInterval) {
        _routine = 0;
        Attach(_pin);
        Serial.println("on");
        _updateInterval = _regularPauseInterval;  
      }
      
      _lastUpdate = millis();
      _position += _increment;
      servo.write(_position);
      
      if ((_position >= _endAngle) || (_position <= _startAngle))
      {
        // reverse direction
        _increment = -_increment;
      }

      if (_position == _centreAngle + 5) {
        _sweepCount ++;
        if (_sweepCount == 2) {
          _updateInterval = _centrePauseInterval;
          //Serial.println("*********************************");
          _routine = 1;
          Detach();
          Serial.println("off");
          _sweepCount = 0;
        }
      }
      //else {
        //if (_routine == 0) {
        //_updateInterval == _regularPauseInterval;
        //}
      //}
    }
  }
};

const int MONSTER_SERVO_OUTPUT_PIN = 14;
const int BAUD_RATE = 115200;

MonsterServo monsterServo(35, 5, 75, MONSTER_SERVO_OUTPUT_PIN);
  
void setup() {
  Serial.begin(BAUD_RATE);
  //monsterServo.Attach(MONSTER_SERVO_OUTPUT_PIN);
}

void loop() {
  monsterServo.Update();
}
