import RPi.GPIO as GPIO
from picamera import PiCamera
from time import sleep
from datetime import datetime
GPIO.setmode(GPIO.BCM)
 
# Pin 19 will sense for button pushing
button = 24
GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)


#Camera Options
camera = PiCamera()
camera.resolution = (1920, 1080)
camera.vflip = True
 
#The LED
led = 16
GPIO.setup(led, GPIO.OUT)
try: 
	while True:
	    input_state = GPIO.input(button) # Sense the button
	    if input_state == False: # Backwards logic for on-board pull-down resistor
	    	print('Grabbing frame')
     	    	GPIO.output(led, 1)# Switch on the LED
	    	camera.start_preview() #Start Camera
	    	sleep(2) #CameraWarmup
	    	currenttime=str(datetime.now()) # Get current time
	    	filename = '%s.jpg' % currenttime # Create timestamped filename
	    	camera.capture(filename) # write file
	    	print ('frame written as', filename)
	    	GPIO.output(led, 0) # Close LED

  	else:
           	# Switch off LED
           	GPIO.output(led, 0)
except KeyboardInterrupt:
	print ('\nClosing GPIO')
	GPIO.cleanup()
