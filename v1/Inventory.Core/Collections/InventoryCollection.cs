using System.Collections;
using System.Collections.Concurrent;
using Inventory.Core.Entities;
using Inventory.Core.Enums;

namespace Inventory.Core.Collections;

public class InventoryCollection<T> : IEnumerable<T> where T : Product
{
    private readonly ConcurrentDictionary<int, T> _itemsById;
    private readonly ConcurrentDictionary<string, List<T>> _itemsBySku;
    private readonly ConcurrentDictionary<string, List<T>> _itemsByCategory;
    private readonly ConcurrentDictionary<string, List<T>> _itemsByLocation;
    private readonly ConcurrentDictionary<ProductStatus, List<T>> _itemsByStatus;
    private readonly object _lockObject = new();

    public InventoryCollection()
    {
        _itemsById = new ConcurrentDictionary<int, T>();
        _itemsBySku = new ConcurrentDictionary<string, List<T>>();
        _itemsByCategory = new ConcurrentDictionary<string, List<T>>();
        _itemsByLocation = new ConcurrentDictionary<string, List<T>>();
        _itemsByStatus = new ConcurrentDictionary<ProductStatus, List<T>>();
    }

 
    public T? this[int id] => _itemsById.TryGetValue(id, out var item) ? item : null;

 
    public IEnumerable<T> this[string sku] => 
        _itemsBySku.TryGetValue(sku, out var items) ? items.AsEnumerable() : Enumerable.Empty<T>();

  
    public IEnumerable<T> this[string category, bool isCategory] => 
        isCategory && _itemsByCategory.TryGetValue(category, out var items) ? items.AsEnumerable() : Enumerable.Empty<T>();

   
    public IEnumerable<T> this[string location, string locationType] => 
        locationType == "location" && _itemsByLocation.TryGetValue(location, out var items) ? items.AsEnumerable() : Enumerable.Empty<T>();

   
    public IEnumerable<T> this[ProductStatus status] => 
        _itemsByStatus.TryGetValue(status, out var items) ? items.AsEnumerable() : Enumerable.Empty<T>();


    public T? this[Index index]
    {
        get
        {
            var items = _itemsById.Values.ToArray();
            var actualIndex = index.IsFromEnd ? items.Length - index.Value : index.Value;
            return actualIndex >= 0 && actualIndex < items.Length ? items[actualIndex] : null;
        }
    }


    public IEnumerable<T> this[Range range]
    {
        get
        {
            var items = _itemsById.Values.ToArray();
            var (offset, length) = range.GetOffsetAndLength(items.Length);
            return items.Skip(offset).Take(length);
        }
    }

    public int Count => _itemsById.Count;

    // Ajouter
    public void Add(T item)
    {
        if (item == null) return;

        lock (_lockObject)
        {
            _itemsById.AddOrUpdate(item.Id, item, (_, _) => item);
            UpdateIndexes(item);
        }
    }

    // Supprimer
    public bool Remove(int id)
    {
        if (!_itemsById.TryRemove(id, out var item)) return false;

        lock (_lockObject)
        {
            RemoveFromIndexes(item);
        }
        return true;
    }

    // Vider
    public void Clear()
    {
        lock (_lockObject)
        {
            _itemsById.Clear();
            _itemsBySku.Clear();
            _itemsByCategory.Clear();
            _itemsByLocation.Clear();
            _itemsByStatus.Clear();
        }
    }

    // Filtres
    public IEnumerable<T> WhereStatus(ProductStatus status) => this[status];
    public IEnumerable<T> WhereCategory(string category) => this[category, true];
    public IEnumerable<T> WhereLocation(string location) => this[location, "location"];
    public IEnumerable<T> WhereLowStock() => _itemsById.Values.Where(x => x.IsLowStock);
    public IEnumerable<T> WhereOutOfStock() => _itemsById.Values.Where(x => x.IsOutOfStock);
    public IEnumerable<T> WhereNeedsRestock() => _itemsById.Values.Where(x => x.NeedsRestock());

    // Statistiques
    public decimal TotalValue => _itemsById.Values.Sum(x => x.TotalValue);
    public int TotalQuantity => _itemsById.Values.Sum(x => x.Quantity);
    public int CountByStatus(ProductStatus status) => this[status].Count();

    // Privé
    private void UpdateIndexes(T item)
    {
        UpdateSkuIndex(item);
        UpdateCategoryIndex(item);
        UpdateLocationIndex(item);
        UpdateStatusIndex(item);
    }

    private void RemoveFromIndexes(T item)
    {
        RemoveFromSkuIndex(item);
        RemoveFromCategoryIndex(item);
        RemoveFromLocationIndex(item);
        RemoveFromStatusIndex(item);
    }

    private void UpdateSkuIndex(T item)
    {
        _itemsBySku.AddOrUpdate(item.SKU, new List<T> { item }, (_, list) =>
        {
            list.RemoveAll(x => x.Id == item.Id);
            list.Add(item);
            return list;
        });
    }

    private void UpdateCategoryIndex(T item)
    {
        _itemsByCategory.AddOrUpdate(item.Category, new List<T> { item }, (_, list) =>
        {
            list.RemoveAll(x => x.Id == item.Id);
            list.Add(item);
            return list;
        });
    }

    private void UpdateLocationIndex(T item)
    {
        _itemsByLocation.AddOrUpdate(item.Location, new List<T> { item }, (_, list) =>
        {
            list.RemoveAll(x => x.Id == item.Id);
            list.Add(item);
            return list;
        });
    }

    private void UpdateStatusIndex(T item)
    {
        _itemsByStatus.AddOrUpdate(item.Status, new List<T> { item }, (_, list) =>
        {
            list.RemoveAll(x => x.Id == item.Id);
            list.Add(item);
            return list;
        });
    }

    private void RemoveFromSkuIndex(T item)
    {
        if (_itemsBySku.TryGetValue(item.SKU, out var list))
        {
            list.RemoveAll(x => x.Id == item.Id);
            if (list.Count == 0)
                _itemsBySku.TryRemove(item.SKU, out _);
        }
    }

    private void RemoveFromCategoryIndex(T item)
    {
        if (_itemsByCategory.TryGetValue(item.Category, out var list))
        {
            list.RemoveAll(x => x.Id == item.Id);
            if (list.Count == 0)
                _itemsByCategory.TryRemove(item.Category, out _);
        }
    }

    private void RemoveFromLocationIndex(T item)
    {
        if (_itemsByLocation.TryGetValue(item.Location, out var list))
        {
            list.RemoveAll(x => x.Id == item.Id);
            if (list.Count == 0)
                _itemsByLocation.TryRemove(item.Location, out _);
        }
    }

    private void RemoveFromStatusIndex(T item)
    {
        if (_itemsByStatus.TryGetValue(item.Status, out var list))
        {
            list.RemoveAll(x => x.Id == item.Id);
            if (list.Count == 0)
                _itemsByStatus.TryRemove(item.Status, out _);
        }
    }

    public IEnumerator<T> GetEnumerator() => _itemsById.Values.GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
