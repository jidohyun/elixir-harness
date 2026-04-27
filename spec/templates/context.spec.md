# App.Context

One-paragraph responsibility description.

## Type
context

## Delegates

- list_entities/1: Context.Repository.list_entities/1

## Functions

### list_entities/1

Returns scoped entities.

```elixir
@spec list_entities(Scope.t()) :: list(Entity.t())
```

**Process**:
1. Extract scope identity.
2. Query through repository.
3. Return list.

**Test Assertions**:
- returns records visible to the scope
- does not return records outside the scope
- returns empty list when none exist
