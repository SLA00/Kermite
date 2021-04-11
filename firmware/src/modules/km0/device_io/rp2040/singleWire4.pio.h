// -------------------------------------------------- //
// This file is autogenerated by pioasm; do not edit! //
// -------------------------------------------------- //

#if !PICO_NO_HARDWARE
#include "hardware/pio.h"
#endif

// ------------------ //
// prog_singlewire_tx //
// ------------------ //

#define prog_singlewire_tx_wrap_target 0
#define prog_singlewire_tx_wrap 14

static const uint16_t prog_singlewire_tx_program_instructions[] = {
            //     .wrap_target
    0xab42, //  0: nop                           [11]
    0x80a0, //  1: pull   block                      
    0xe028, //  2: set    x, 8                       
    0xe781, //  3: set    pindirs, 1             [7] 
    0x6041, //  4: out    y, 1                       
    0x0069, //  5: jmp    !y, 9                      
    0xe580, //  6: set    pindirs, 0             [5] 
    0xe081, //  7: set    pindirs, 1                 
    0x000b, //  8: jmp    11                         
    0xe280, //  9: set    pindirs, 0             [2] 
    0xe181, // 10: set    pindirs, 1             [1] 
    0x0044, // 11: jmp    x--, 4                     
    0xa142, // 12: nop                           [1] 
    0xe080, // 13: set    pindirs, 0                 
    0x8020, // 14: push   block                      
            //     .wrap
};

#if !PICO_NO_HARDWARE
static const struct pio_program prog_singlewire_tx_program = {
    .instructions = prog_singlewire_tx_program_instructions,
    .length = 15,
    .origin = -1,
};

static inline pio_sm_config prog_singlewire_tx_program_get_default_config(uint offset) {
    pio_sm_config c = pio_get_default_sm_config();
    sm_config_set_wrap(&c, offset + prog_singlewire_tx_wrap_target, offset + prog_singlewire_tx_wrap);
    return c;
}
#endif

// ------------------ //
// prog_singlewire_rx //
// ------------------ //

#define prog_singlewire_rx_wrap_target 0
#define prog_singlewire_rx_wrap 10

static const uint16_t prog_singlewire_rx_program_instructions[] = {
            //     .wrap_target
    0x2020, //  0: wait   0 pin, 0                   
    0xb042, //  1: nop                    side 0     
    0xe028, //  2: set    x, 8                       
    0x20a0, //  3: wait   1 pin, 0                   
    0xb942, //  4: nop                    side 1 [1] 
    0x4001, //  5: in     pins, 1                    
    0xb042, //  6: nop                    side 0     
    0x0043, //  7: jmp    x--, 3                     
    0xa442, //  8: nop                           [4] 
    0xb842, //  9: nop                    side 1     
    0x8020, // 10: push   block                      
            //     .wrap
};

#if !PICO_NO_HARDWARE
static const struct pio_program prog_singlewire_rx_program = {
    .instructions = prog_singlewire_rx_program_instructions,
    .length = 11,
    .origin = -1,
};

static inline pio_sm_config prog_singlewire_rx_program_get_default_config(uint offset) {
    pio_sm_config c = pio_get_default_sm_config();
    sm_config_set_wrap(&c, offset + prog_singlewire_rx_wrap_target, offset + prog_singlewire_rx_wrap);
    sm_config_set_sideset(&c, 2, true, false);
    return c;
}
#endif

