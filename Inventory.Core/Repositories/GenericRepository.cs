using Inventory.Core.Collections;
using Inventory.Core.Contracts;

namespace Inventory.Core.Repositories;

public interface IGenericRepository<T, TKey> : IQueryable<T, TKey>
    where T : class
    where TKey : notnull
{
    Task<T?> GetByIdAsync(TKey id);
    Task<IGenericCollection<T, TKey>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(TKey id);
    Task<int> SaveChangesAsync();
}

public class InMemoryRepository<T, TKey> : IGenericRepository<T, TKey>
    where T : class
    where TKey : notnull, IComparable<TKey>
{
    private readonly IGenericCollection<T, TKey> _data;

    public InMemoryRepository(Func<T, TKey> keySelector)
    {
        _data = new GenericCollection<T, TKey>(keySelector);
    }

    public Task<T?> GetByIdAsync(TKey id)
    {
        return Task.FromResult(_data[id]);
    }

    public Task<IGenericCollection<T, TKey>> GetAllAsync()
    {
        return Task.FromResult(_data);
    }

    public Task<T> AddAsync(T entity)
    {
        _data.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<T> UpdateAsync(T entity)
    {
        _data.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<bool> DeleteAsync(TKey id)
    {
        return Task.FromResult(_data.Remove(id));
    }

    public Task<int> SaveChangesAsync()
    {
        return Task.FromResult(_data.Count);
    }

    public IEnumerable<T> Query(Func<T, bool> predicate)
    {
        return _data.Where(predicate);
    }

    public T? FindByKey(TKey key)
    {
        return _data[key];
    }

    public IEnumerable<T> FindAll(params TKey[] keys)
    {
        return keys.Select(key => _data[key]).Where(item => item != null)!;
    }

    public IEnumerable<TResult> Project<TResult>(Func<T, TResult> selector)
    {
        return _data.Select(selector);
    }
}

public class GenericRepository<T, TKey> : InMemoryRepository<T, TKey>
    where T : class
    where TKey : notnull, IComparable<TKey>
{
    public GenericRepository(Func<T, TKey> keySelector) : base(keySelector)
    {
    }
}
