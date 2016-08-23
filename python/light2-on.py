import wiringpi
from time import sleep


wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(18,1)

wiringpi.digitalWrite(18,0)


