#include <node.h>
#include <v8.h>
#include <v8-profiler.h>

#include "nopro.h"

using namespace v8;

//------------------------------------------------------------------------------

static Handle<Object> getProfileNodeTree(const CpuProfileNode* node);

static Handle<String> getHeapNodeObject(Handle<Object> nodes, const HeapGraphNode* node);
static Handle<Value>  getHeapEdgeObject(Handle<Object> nodes, const HeapGraphEdge* edge);

//------------------------------------------------------------------------------

Handle<Value> NoProProfilerStart(const Arguments& args) {
    HandleScope scope;
    
//    printf("in native NoProProfilerStart()\n");
    
    CpuProfiler::StartProfiling(String::New(""));
    
    return scope.Close(Undefined());
}

//------------------------------------------------------------------------------

Handle<Value> NoProProfilerStop(const Arguments& args) {
    HandleScope scope;

//    printf("in native NoProProfilerStop()\n");

    CpuProfile* profile = (CpuProfile*)CpuProfiler::StopProfiling(
        String::New(""), Handle<Value>(NULL)
    );

    Local<Object> result = Object::New();
    
    PROP_SET(result, "rootBottomUp", getProfileNodeTree(profile->GetBottomUpRoot()));
    PROP_SET(result, "rootTopDown",  getProfileNodeTree(profile->GetTopDownRoot() ));
    
    profile->Delete();

    return scope.Close(result);
}

//------------------------------------------------------------------------------
Handle<Object> getProfileNodeTree(const CpuProfileNode* node) {
    HandleScope scope;
    
    Local<Object> nodeObject = Object::New();
    Local<Array>  children = Array::New();
    
    PROP_SET(        nodeObject, "functionName", node->GetFunctionName());
    PROP_SET(        nodeObject, "scriptName",   node->GetScriptResourceName());
    PROP_SET_NUMBER( nodeObject, "lineNumber",   node->GetLineNumber());
    PROP_SET_NUMBER( nodeObject, "totalTime",    node->GetTotalTime());
    PROP_SET_NUMBER( nodeObject, "selfTime",     node->GetSelfTime());
    PROP_SET_NUMBER( nodeObject, "totalSamples", node->GetTotalSamplesCount());
    PROP_SET_NUMBER( nodeObject, "selfSamples",  node->GetSelfSamplesCount());
    PROP_SET(        nodeObject, "children",     children);

    int childrenCount = node->GetChildrenCount();
    
    for (int i=0; i<childrenCount; i++) {
        const CpuProfileNode* child = node->GetChild(i);
        children->Set(i, getProfileNodeTree(child));
    }
    
    return scope.Close(nodeObject);
}

//------------------------------------------------------------------------------

Handle<Value> NoProHeapSnapShotTake(const Arguments& args) {
    HandleScope   scope;

//    printf("in  native NoProHeapSnapShotTake()\n");

    HeapSnapshot* snapShot = (HeapSnapshot*) HeapProfiler::TakeSnapshot(String::New(""));

    Local<Object>        result = Object::New();
    Local<Object>        nodes  = Object::New();
    const HeapGraphNode* root   = snapShot->GetRoot();
    
    getHeapNodeObject(nodes, root);
    
    PROP_SET(result, "root",  getHeapNodeObject(nodes, snapShot->GetRoot()));
    PROP_SET(result, "nodes", nodes);

    snapShot->Delete();
    
    return scope.Close(result);
}

//------------------------------------------------------------------------------

Handle<String> getHeapNodeObject(Handle<Object> nodes, const HeapGraphNode* node) {
    HandleScope   scope;
    
    Handle<String> stringPtr = pointer2string(node);
    
    // String::Utf8Value stringUtf8(stringPtr);
    // printf("processing node %s\n", *stringUtf8);

    if (nodes->Has(stringPtr)) {
        // printf("   already handled!\n");
        return scope.Close(stringPtr);
    }

    Local<Object> result = Object::New();
    nodes->Set(stringPtr, result);
    
    Local<Array> children = Array::New();
    
    PROP_SET_NUMBER( result, "type",  node->GetType());
    PROP_SET(        result, "name",  node->GetName());
    PROP_SET_NUMBER( result, "size",  node->GetSelfSize());
    PROP_SET(        result, "edges", children);
    
    int count = node->GetChildrenCount();
    
    for (int i=0; i<count; i++) {
        const HeapGraphEdge* edge = node->GetChild(i);
        
        children->Set(i, getHeapEdgeObject(nodes, edge));
    }
    
    return scope.Close(stringPtr);
}

//------------------------------------------------------------------------------

Handle<Value> getHeapEdgeObject(Handle<Object> nodes, const HeapGraphEdge* edge) {
    HandleScope   scope;

    // String::Utf8Value stringUtf8(pointer2string(edge));
    // printf("processing edge %s\n", *stringUtf8);

    Local<Object> result = Object::New();

    const HeapGraphNode* toNode = edge->GetToNode();
    
    PROP_SET_NUMBER( result, "type", edge->GetType());
    PROP_SET(        result, "name", edge->GetName());
    PROP_SET(        result, "node", getHeapNodeObject(nodes, toNode));
    
    return scope.Close(result);
}

//------------------------------------------------------------------------------

void init(Handle<Object> target) {
    PROP_SET_FUNCTION(target, "profilerStart",       NoProProfilerStart);    
    PROP_SET_FUNCTION(target, "profilerStop",        NoProProfilerStop);    
    PROP_SET_FUNCTION(target, "heapSnapShotTake",    NoProHeapSnapShotTake);
}

//------------------------------------------------------------------------------

NODE_MODULE(nopro_natives, init)