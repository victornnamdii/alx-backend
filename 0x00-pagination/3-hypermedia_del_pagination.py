#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Returns page data, index and next index
        """
        idxs = self.indexed_dataset().keys()
        assert index <= max(idxs) and index >= 0
        trueIdx = index
        while trueIdx not in idxs and trueIdx <= max(idxs):
            trueIdx += 1
        data = []
        while len(data) < page_size and trueIdx <= max(idxs):
            row = self.indexed_dataset().get(trueIdx)
            if row:
                data.append(row)
            trueIdx += 1
        while trueIdx not in idxs and trueIdx <= max(idxs):
            trueIdx += 1
        return {
            'index': index,
            'next_index': trueIdx if trueIdx <= max(idxs) else None,
            'page_size': len(data),
            'data': data
        }
