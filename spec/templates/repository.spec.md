# App.Context.Repository

Data access layer for a context.

## Type
module

## Functions

### create_entity/2

Creates an entity.

```elixir
@spec create_entity(Scope.t(), map()) :: {:ok, Entity.t()} | {:error, Ecto.Changeset.t()}
```

**Process**:
1. Validate scope/authorization.
2. Build changeset.
3. Insert inside transaction if needed.
4. Return result tuple.

**Test Assertions**:
- creates with valid attrs
- rejects invalid attrs
- enforces scope isolation
- does not partially persist on transaction failure
