import wiringpi
from time import sleep


wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(17,1)

wiringpi.digitalWrite(17,0)


