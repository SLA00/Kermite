TARGET_MCU = rp2040

MODULE_SRCS += km0/base/utils.c
MODULE_SRCS += km0/device/rp2040/system.c
MODULE_SRCS += km0/device/rp2040/digitalIo.c
MODULE_SRCS += km0/device/rp2040/usbIoCore.c
MODULE_SRCS += km0/device/rp2040/dataMemory.c
MODULE_SRCS += km0/device/rp2040/debugUart.c
MODULE_SRCS += km0/device/rp2040/boardIo.c
MODULE_SRCS += km0/device/rp2040/boardI2c.c
MODULE_SRCS += km0/kernel/dataStorage.c
MODULE_SRCS += km0/kernel/configManager.c
MODULE_SRCS += km0/kernel/keyMappingDataValidator.c
MODULE_SRCS += km0/kernel/configuratorServant.c
MODULE_SRCS += km0/kernel/keyCodeTranslator.c
MODULE_SRCS += km0/kernel/keyActionRemapper.c
MODULE_SRCS += km0/kernel/keyboardCoreLogic.c
MODULE_SRCS += km0/kernel/keyboardMain.c
MODULE_SRCS += km0/scanner/keyScanner_directWired.c
MODULE_SRCS += km0/visualizer/oledDisplay_rp/oledCoreEx.c
MODULE_SRCS += km0/visualizer/oledDisplay_rp/oledDisplayEx_default.c
MODULE_SRCS += km0/wrapper/generalKeyboard.c

PROJECT_SRCS += main.c
