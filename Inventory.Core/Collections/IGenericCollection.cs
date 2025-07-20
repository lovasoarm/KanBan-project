using System.Collections;

namespace Inventory.Core.Collections;

public interface IGenericCollection<T, TKey> : IEnumerable<T>
    where T : class
    where TKey : notnull
{
    T? this[TKey key] { get; set; }
    T? this[int index] { get; }
    
    int Count { get; }
    bool IsReadOnly { get; }
    IEnumerable<TKey> Keys { get; }
    IEnumerable<T> Values { get; }
    
    void Add(T item);
    bool Remove(TKey key);
    bool Remove(T item);
    void Clear();
    bool Contains(TKey key);
    bool Contains(T item);
    bool TryGetValue(TKey key, out T? value);
    
    IEnumerable<T> Where(Func<T, bool> predicate);
    T? FirstOrDefault(Func<T, bool> predicate);
    TResult[] Select<TResult>(Func<T, TResult> selector);
}
