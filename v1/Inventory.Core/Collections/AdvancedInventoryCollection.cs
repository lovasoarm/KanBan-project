using System.Collections;
using Inventory.Core.Entities;
using Inventory.Core.Enums;

namespace Inventory.Core.Collections;

public class AdvancedInventoryCollection<T> : ICollection<T>, IEnumerable<T> 
    where T : Product
{
    private readonly SmartIndexer<T> _indexer = new();
    private readonly ReaderWriterLockSlim _lock = new();

    public int Count { get; private set; }
    public bool IsReadOnly => false;

    // PrimaryIndexers
    public T? this[int id] => ExecuteRead<T?>(() => _indexer[id]);
    
    public IEnumerable<T> this[string key] => ExecuteRead<IEnumerable<T>>(() => _indexer[key]);
    
    public IEnumerable<T> this[ProductStatus status] => ExecuteRead<IEnumerable<T>>(() => _indexer[status]);
    
    public IEnumerable<T> this[decimal min, decimal max] => ExecuteRead<IEnumerable<T>>(() => _indexer[min, max]);

    // FluentQuery
    public InventoryQuery<T> Query() => new(this);

    // CoreOperations
    public void Add(T item)
    {
        ExecuteWrite(() =>
        {
            _indexer.Add(item);
            Count++;
        });
    }

    public bool Remove(T item) => ExecuteWrite(() =>
    {
        if (_indexer.Remove(item))
        {
            Count--;
            return true;
        }
        return false;
    });

    public void Clear() => ExecuteWrite(() =>
    {
        _indexer.Clear();
        Count = 0;
    });

    public bool Contains(T item) => ExecuteRead(() => _indexer[item.Id]?.Equals(item) == true);

    public void CopyTo(T[] array, int arrayIndex) => 
        ExecuteRead(() => this.ToArray().CopyTo(array, arrayIndex));

    // Enumeration
    public IEnumerator<T> GetEnumerator() => ExecuteRead(() => _indexer.GetEnumerator());
    
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

    // ThreadSafety
    private TResult ExecuteRead<TResult>(Func<TResult> operation)
    {
        _lock.EnterReadLock();
        try { return operation(); }
        finally { _lock.ExitReadLock(); }
    }

    private void ExecuteWrite(Action operation)
    {
        _lock.EnterWriteLock();
        try { operation(); }
        finally { _lock.ExitWriteLock(); }
    }

    private TResult ExecuteWrite<TResult>(Func<TResult> operation)
    {
        _lock.EnterWriteLock();
        try { return operation(); }
        finally { _lock.ExitWriteLock(); }
    }
}

public class InventoryQuery<T> where T : Product
{
    private readonly AdvancedInventoryCollection<T> _collection;
    private IEnumerable<T> _current;

    internal InventoryQuery(AdvancedInventoryCollection<T> collection)
    {
        _collection = collection;
        _current = collection;
    }

    // Filters
    public InventoryQuery<T> Status(ProductStatus status)
    {
        _current = _current.Where(p => p.Status == status);
        return this;
    }

    public InventoryQuery<T> Category(string category)
    {
        _current = _current.Where(p => p.Category == category);
        return this;
    }

    public InventoryQuery<T> PriceRange(decimal min, decimal max)
    {
        _current = _current.Where(p => p.Price >= min && p.Price <= max);
        return this;
    }

    public InventoryQuery<T> LowStock()
    {
        _current = _current.Where(p => p.IsLowStock);
        return this;
    }

    public InventoryQuery<T> Location(string location)
    {
        _current = _current.Where(p => p.Location == location);
        return this;
    }

    // Results
    public IEnumerable<T> ToEnumerable() => _current;
    public T[] ToArray() => _current.ToArray();
    public List<T> ToList() => _current.ToList();
    public T? FirstOrDefault() => _current.FirstOrDefault();
    public int Count() => _current.Count();
}
