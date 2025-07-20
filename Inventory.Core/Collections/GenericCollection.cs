using System.Collections;
using System.Collections.Concurrent;

namespace Inventory.Core.Collections;

public class GenericCollection<T, TKey> : IGenericCollection<T, TKey>
    where T : class
    where TKey : notnull
{
    private readonly ConcurrentDictionary<TKey, T> _items;
    private readonly Func<T, TKey> _keySelector;

    public GenericCollection(Func<T, TKey> keySelector)
    {
        _keySelector = keySelector ?? throw new ArgumentNullException(nameof(keySelector));
        _items = new ConcurrentDictionary<TKey, T>();
    }

    public T? this[TKey key]
    {
        get => _items.TryGetValue(key, out var item) ? item : null;
        set
        {
            if (value == null)
            {
                _items.TryRemove(key, out _);
                return;
            }
            
            var itemKey = _keySelector(value);
            if (!itemKey.Equals(key))
                throw new ArgumentException("Item key does not match collection key");
                
            _items.AddOrUpdate(key, value, (_, _) => value);
        }
    }

    public T? this[int index]
    {
        get
        {
            if (index < 0 || index >= Count)
                throw new IndexOutOfRangeException();
                
            return _items.Values.Skip(index).FirstOrDefault();
        }
    }

    public int Count => _items.Count;
    public bool IsReadOnly => false;
    public IEnumerable<TKey> Keys => _items.Keys;
    public IEnumerable<T> Values => _items.Values;

    public void Add(T item)
    {
        if (item == null) throw new ArgumentNullException(nameof(item));
        
        var key = _keySelector(item);
        _items.AddOrUpdate(key, item, (_, _) => item);
    }

    public bool Remove(TKey key) => _items.TryRemove(key, out _);

    public bool Remove(T item)
    {
        if (item == null) return false;
        
        var key = _keySelector(item);
        return _items.TryRemove(key, out _);
    }

    public void Clear() => _items.Clear();

    public bool Contains(TKey key) => _items.ContainsKey(key);

    public bool Contains(T item)
    {
        if (item == null) return false;
        
        var key = _keySelector(item);
        return _items.TryGetValue(key, out var existing) && ReferenceEquals(existing, item);
    }

    public bool TryGetValue(TKey key, out T? value) => _items.TryGetValue(key, out value);

    public IEnumerable<T> Where(Func<T, bool> predicate) => _items.Values.Where(predicate);

    public T? FirstOrDefault(Func<T, bool> predicate) => _items.Values.FirstOrDefault(predicate);

    public TResult[] Select<TResult>(Func<T, TResult> selector) => _items.Values.Select(selector).ToArray();

    public IEnumerator<T> GetEnumerator() => _items.Values.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
