import wiringpi
from time import sleep


wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(27,1)

wiringpi.digitalWrite(27,0)


