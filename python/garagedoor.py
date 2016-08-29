import wiringpi
from time import sleep


wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(25,1)

wiringpi.digitalWrite(25,0)
sleep(.5)
wiringpi.digitalWrite(25,1)

