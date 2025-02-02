#pragma once

#include <avr/io.h>

#define P_B0 0
#define P_B1 1
#define P_B2 2
#define P_B3 3
#define P_B4 4
#define P_B5 5
#define P_B6 6
#define P_B7 7

#define P_C0 8
#define P_C1 9
#define P_C2 10
#define P_C3 11
#define P_C4 12
#define P_C5 13
#define P_C6 14
#define P_C7 15

#define P_D0 16
#define P_D1 17
#define P_D2 18
#define P_D3 19
#define P_D4 20
#define P_D5 21
#define P_D6 22
#define P_D7 23

#define P_E0 24
#define P_E1 25
#define P_E2 26
#define P_E3 27
#define P_E4 28
#define P_E5 29
#define P_E6 30
#define P_E7 31

#define P_F0 32
#define P_F1 33
#define P_F2 34
#define P_F3 35
#define P_F4 36
#define P_F5 37
#define P_F6 38
#define P_F7 39

#define B0 0
#define B1 1
#define B2 2
#define B3 3
#define B4 4
#define B5 5
#define B6 6
#define B7 7

#define C0 8
#define C1 9
#define C2 10
#define C3 11
#define C4 12
#define C5 13
#define C6 14
#define C7 15

#define D0 16
#define D1 17
#define D2 18
#define D3 19
#define D4 20
#define D5 21
#define D6 22
#define D7 23

#define E0 24
#define E1 25
#define E2 26
#define E3 27
#define E4 28
#define E5 29
#define E6 30
#define E7 31

#define F0 32
#define F1 33
#define F2 34
#define F3 35
#define F4 36
#define F5 37
#define F6 38
#define F7 39

#define portIndex(p) ((p) >> 3)
#define portBit(p) ((p)&0x07)

#define regPINX(p) _SFR_IO8(0x03 + 3 * portIndex(p))
#define regDDRX(p) _SFR_IO8(0x04 + 3 * portIndex(p))
#define regPORTX(p) _SFR_IO8(0x05 + 3 * portIndex(p))
