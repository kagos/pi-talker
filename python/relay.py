import wiringpi
from time import sleep


wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(17,1)

wiringpi.digitalWrite(17,1)
sleep(.5)
wiringpi.digitalWrite(17,0)
sleep(.5)
wiringpi.digitalWrite(17,1)

sleep(.5)
wiringpi.digitalWrite(17,0)
sleep(.5)
wiringpi.digitalWrite(17,1)


