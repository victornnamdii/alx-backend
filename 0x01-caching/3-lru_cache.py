#!/usr/bin/env python3
"""
Learning Caching
"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRU Caching System
    """
    used = 0

    def __init__(self):
        super().__init__()
        self.lru_data = {}

    def put(self, key, item):
        """
        Add an item to the cache
        """
        if key is not None and item is not None:
            self.cache_data[key] = item
            self.lru_data[key] = self.used
            self.used += 1
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                lru = min(self.lru_data.values())
                for k, v in self.lru_data.items():
                    if v == lru:
                        break
                del self.cache_data[k]
                del self.lru_data[k]
                print("DISCARD: {}".format(k))

    def get(self, key):
        """
        Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        self.lru_data[key] = self.used
        self.used += 1
        return self.cache_data[key]
