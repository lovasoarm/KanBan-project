using System.Collections.Concurrent;
using Inventory.Core.Entities;
using Inventory.Core.Enums;

namespace Inventory.Core.Collections;

public class SmartIndexer<T> where T : Product
{
    private readonly ConcurrentDictionary<int, T> _byId = new();
    private readonly ConcurrentDictionary<string, HashSet<T>> _bySku = new();
    private readonly ConcurrentDictionary<string, HashSet<T>> _byCategory = new();
    private readonly ConcurrentDictionary<string, HashSet<T>> _byLocation = new();
    private readonly ConcurrentDictionary<ProductStatus, HashSet<T>> _byStatus = new();
    private readonly ConcurrentDictionary<string, HashSet<T>> _bySupplier = new();

    // MultiAccess
    public T? this[int id] => _byId.TryGetValue(id, out var item) ? item : null;
    
    public IEnumerable<T> this[string key] => GetByString(key);
    
    public IEnumerable<T> this[ProductStatus status] => 
        _byStatus.TryGetValue(status, out var items) ? items : Enumerable.Empty<T>();
    
    public IEnumerable<T> this[decimal minPrice, decimal maxPrice] => 
        _byId.Values.Where(p => p.Price >= minPrice && p.Price <= maxPrice);
    
    public IEnumerable<T> this[Range range] => 
        _byId.Values.Skip(range.Start.Value).Take(range.End.Value - range.Start.Value);

    // StringQuery
    private IEnumerable<T> GetByString(string key)
    {
        var results = new HashSet<T>();
        
        if (_bySku.TryGetValue(key, out var bySkuItems))
            results.UnionWith(bySkuItems);
            
        if (_byCategory.TryGetValue(key, out var byCategoryItems))
            results.UnionWith(byCategoryItems);
            
        if (_byLocation.TryGetValue(key, out var byLocationItems))
            results.UnionWith(byLocationItems);
            
        if (_bySupplier.TryGetValue(key, out var bySupplierItems))
            results.UnionWith(bySupplierItems);

        return results;
    }

    // Management
    public void Add(T item)
    {
        _byId[item.Id] = item;
        AddToIndex(_bySku, item.SKU, item);
        AddToIndex(_byCategory, item.Category, item);
        AddToIndex(_byLocation, item.Location, item);
        AddToIndex(_byStatus, item.Status, item);
        AddToIndex(_bySupplier, item.Supplier, item);
    }

    public bool Remove(T item)
    {
        if (!_byId.TryRemove(item.Id, out _)) return false;
        
        RemoveFromIndex(_bySku, item.SKU, item);
        RemoveFromIndex(_byCategory, item.Category, item);
        RemoveFromIndex(_byLocation, item.Location, item);
        RemoveFromIndex(_byStatus, item.Status, item);
        RemoveFromIndex(_bySupplier, item.Supplier, item);
        
        return true;
    }

    // IndexManagement
    private void AddToIndex<TKey>(ConcurrentDictionary<TKey, HashSet<T>> index, TKey key, T item)
        where TKey : notnull
    {
        index.AddOrUpdate(key, new HashSet<T> { item }, (_, set) =>
        {
            set.Add(item);
            return set;
        });
    }

    private void RemoveFromIndex<TKey>(ConcurrentDictionary<TKey, HashSet<T>> index, TKey key, T item)
        where TKey : notnull
    {
        if (index.TryGetValue(key, out var set))
        {
            set.Remove(item);
            if (set.Count == 0)
                index.TryRemove(key, out _);
        }
    }

    // Utilities
    public void Clear()
    {
        _byId.Clear();
        _bySku.Clear();
        _byCategory.Clear();
        _byLocation.Clear();
        _byStatus.Clear();
        _bySupplier.Clear();
    }

    public IEnumerator<T> GetEnumerator() => _byId.Values.GetEnumerator();
}
