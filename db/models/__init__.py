"""caelum_platform models."""
from importlib import import_module
from pathlib import Path


def load_all_models() -> None:
    """Load all models from this folder."""
    package_dir = Path(__file__).parent.parent

    for item in package_dir.glob("**/*.py"):
        if item.name == "__init__.py":
            continue

        module = str(item).replace("/", ".").replace(".py", "")
        import_module(module, package=None)
