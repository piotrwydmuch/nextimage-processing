package main

import (
	"fmt"
	"reflect"
	"syscall/js"
)
func add(this js.Value, inputs[]js.Value) interface{} {

	data := inputs[0];

	//length := len(data)

	// for i := 0; i < length; i+= 4 {
	// 	avg := (data[i] + data[i + 1] + data[i + 2]) / 3;
	// 	data[i]     = avg; // red
	// 	data[i + 1] = avg; // green
	// 	data[i + 2] = avg; // blue
	// }

	fmt.Println(reflect.TypeOf(data))
	return data
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

