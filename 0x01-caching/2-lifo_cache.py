#!/usr/bin/env python3
"""
Learning Caching
"""

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFO Caching System
    """
    def put(self, key, item):
        """
        Add an item to the cache
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                    discarded = self.cache_data.popitem()[0]
                    print("DISCARD: {}".format(discarded))
            else:
                del self.cache_data[key]
            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
