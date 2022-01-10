package main

import (
	"fmt"
	"syscall/js"
)
func add(this js.Value, args []js.Value) interface{} {

	// data := inputs[0];

	received := make([]byte, args[0].Get("length").Int())
	_ = js.CopyBytesToGo(received, args[0])
	// fmt.Println(received)
	
	length := len(received)	
	for i := 0; i < length; i+= 4 {
		avg := (received[i] + received[i + 1] + received[i + 2]) / 3;
		received[i]     = avg; // red
		received[i + 1] = avg; // green
		received[i + 2] = avg; // blue
	}
	
	fmt.Println(received)
	

	return nil
		
	// fmt.Println(reflect.TypeOf(data))
	// fmt.Println(reflect.TypeOf(n))
	// return n
}

func main() {
	//App is ready for user actions
	fmt.Println("App ready.")	

	c := make(chan int)
	//n := js.CopyBytesToGo(dst, newBitmap)		
	js.Global().Set("add", js.FuncOf(add))

	// js.CopyBytesToGo(dst []byte, src Value) int
	// func CopyBytesToJS(dst Value, src []byte) int

	<-c
}

