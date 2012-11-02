using namespace v8;

//------------------------------------------------------------------------------

#define PROP_SET(target, name, value) \
    (target->Set(String::NewSymbol(name), value))

#define PROP_SET_FUNCTION(target, name, value) \
    (PROP_SET(target, name, FunctionTemplate::New(value)->GetFunction()))

#define PROP_SET_STRING(target, name, value) \
    (PROP_SET(target, name, String::New(value)))

#define PROP_SET_NUMBER(target, name, value) \
    (PROP_SET(target, name, Number::New(value)))

//------------------------------------------------------------------------------
Handle<String> pointer2string(const void *pointer) {
    HandleScope scope;
    
    char pointerString[40];
    sprintf(pointerString, "%lx", (long) pointer);
    
    return scope.Close(String::New(pointerString));
}

//------------------------------------------------------------------------------
const void* string2pointer(Handle<Value> string) {
    if (!string->IsString()) {
        ThrowException(Exception::TypeError(String::New("expecting a string pointer argument")));
        return NULL;
    }
    
    String::Utf8Value pointerUtf8(string);
    const void* pointer;
    
    sscanf(*pointerUtf8, "%lx", (long *)&pointer);
    
    return pointer;
}

