# A tour of the C# language

Docs example from [docs.microsoft.com](https://docs.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/)

## Hello world

The "Hello, World" program is traditionally used to introduce a programming language. Here it is in C#:
```csharp
using System;

class Hello
{
    static void Main()
    {
        Console.WriteLine("Hello, World");
    }
}
```

## Program structure

The key organizational concepts in C# are **programs**, **namespaces**, **types**, **members**, and **assemblies**. Programs declare types, which contain members and can be organized into namespaces. Classes, structs, and interfaces are examples of types. Fields, methods, properties, and events are examples of members. When C# programs are compiled, they're physically packaged into assemblies. Assemblies typically have the file extension `.exe` or `.dll`, depending on whether they implement applications or libraries, respectively.

As a small example, consider an assembly that contains the following code:

```csharp
namespace Acme.Collections;

public class Stack<T>
{
    Entry _top;

    public void Push(T data)
    {
        _top = new Entry(_top, data);
    }

    public T Pop()
    {
        if (_top == null)
        {
            throw new InvalidOperationException();
        }
        T result = _top.Data;
        _top = _top.Next;

        return result;
    }

    class Entry
    {
        public Entry Next { get; set; }
        public T Data { get; set; }

        public Entry(Entry next, T data)
        {
            Next = next;
            Data = data;
        }
    }
}
```