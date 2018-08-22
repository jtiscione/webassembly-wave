#define WASM_EXPORT __attribute__((visibility("default")))

const int SIZE = 10;
int data[SIZE];

WASM_EXPORT
void add(int value) {
  for (int i=0; i < SIZE; i++) {
    data[i] = data[i] + value;
  }
}

WASM_EXPORT
int* getData() {
    return &data[0];
}
