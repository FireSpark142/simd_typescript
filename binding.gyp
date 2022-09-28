{
  "targets": [
    {
      "target_name": "simdjson",
      "default_configuration": "Release",
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-O3", "-fno-exceptions", "-std=gnu++0x", "-std=gnu++1y"],
      "cflags_cc+": ["-O3", "-std=c++17"],
      "sources": [
        "dist/simdjson/main.cpp",
        "dist/simdjson/src/simdjson.cpp",
        "dist/simdjson/bindings.cpp"
      ],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "defines": ["NAPI_CPP_EXCEPTIONS"]
    }
  ]
}
