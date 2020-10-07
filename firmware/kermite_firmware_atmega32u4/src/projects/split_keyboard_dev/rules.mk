MODULE_SRCS += pio.c
MODULE_SRCS += debug_uart.c
MODULE_SRCS += KeyMatrixScanner2.c
MODULE_SRCS += usbiocore.c
MODULE_SRCS += configuratorServant.c
MODULE_SRCS += xf_eeprom.c
MODULE_SRCS += generalUtils.c
MODULE_SRCS += ConfigurationMemoryReader.c
MODULE_SRCS += keyboardCoreLogic.c

#CFLAGS += -DSINGLEWIRE_SIGNAL_PIN_PD0
CFLAGS += -DSINGLEWIRE_SIGNAL_PIN_PD2
#CFLAGS += -DSINGLEWIRE_ENABLE_TIMING_DEBUG_PINS
MODULE_SRCS += singlewire3.c
#MODULE_SRCS += singlewire3a.c
#MODULE_SRCS += singlewire3b.c
#MODULE_SRCS += singlewire3c.c

#ASFLAGS += -DSINGLEWIRE_SIGNAL_PIN_PD2
#ASFLAGS += -DSINGLEWIRE_ENABLE_TIMING_DEBUG_PINS
#MODULE_ASM_SRCS += singlewire3d.S

PROJECT_SRCS += main.c
