TARGET_MCU = rp2040

MODULE_SRCS += km0/common/utils.c
MODULE_SRCS += km0/deviceIo/rp2040/system.c
MODULE_SRCS += km0/deviceIo/rp2040/digitalIo.c
MODULE_SRCS += km0/deviceIo/rp2040/debugUart.c
MODULE_SRCS += km0/deviceIo/rp2040/boardIo.c

# PROJECT_SRCS += main_pseudo_open_drain.c
PROJECT_SRCS += main_i2c_tca9555.c
# PROJECT_SRCS += main_i2c_master_slave.c
# PROJECT_SRCS += main_oled_minimum.c
