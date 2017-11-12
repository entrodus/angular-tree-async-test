import { Component, ViewChild } from '@angular/core';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { TreeComponent } from 'angular-tree-component';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';

interface MyNode {
  id: number;
  name: string;
  hasChildren: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @ViewChild('tree') tree: TreeComponent;

  rootNodes: MyNode[] = [
    { id: 1, name: 'root1', hasChildren: true },
    { id: 4, name: 'root2', hasChildren: true }
  ];

  options = {
    getChildren: (node: ITreeNode) => {
      const nodes = this.getChildNodes(node);

      return Observable.of(nodes)
        .delay(500)
        .toPromise();

    }
  };

  public getChildNodes(node: ITreeNode): MyNode[] {
    if (node.id === 1) {
      return [
        { id: 2, name: 'child1', hasChildren: false },
        { id: 3, name: 'child2', hasChildren: false }
      ];
    } else if (node.id === 4) {
      return [
        { id: 5, name: 'child2.1', hasChildren: false },
        { id: 6, name: 'child2.2', hasChildren: true }
      ];
    } else if (node.id === 6) {
      return [
        { id: 7, name: 'subsub', hasChildren: false }
      ];
    }

  }

  expandTest(): void {
    // 4 6 7

    // this.expandPathByUsingPromises();
    // this.expandPathByUsingObservables().subscribe(() => {
    //   console.log('finished');
    // });
    // this.expandPathByUsingObservables().subscribe(() => {
    //   console.log('finished');
    // });
  }

  private expandPathByUsingObservables(): Observable<boolean> {

    const treeModel = this.tree.treeModel;
    const node_root2 = treeModel.getNodeById(4);

    const node_root_expand = Observable.fromPromise(node_root2.expand() as Promise<any>);

    const retObs$ = node_root_expand.flatMap(() => {
      const node_child2_2 = treeModel.getNodeById(6) as ITreeNode;
      console.log(node_child2_2.data.name);

      const node_child2_2_expand = Observable.fromPromise(node_child2_2.expand() as Promise<any>);
      return node_child2_2_expand.flatMap(() => {

        const node_subsub = treeModel.getNodeById(7) as ITreeNode;
        console.log(node_subsub.data.name);

        return Observable.of(true);
      })

    });

    return retObs$;
  }

  private expandPathByUsingPromises(): void {
    const treeModel = this.tree.treeModel;
    const node_root2 = treeModel.getNodeById(4);
    const node_root_expand = node_root2.expand() as Promise<any>;
    node_root_expand.then(val => {
      const node_child2_2 = treeModel.getNodeById(6) as ITreeNode;

      const node_child2_2_expand = node_child2_2.expand() as Promise<any>;
      node_child2_2_expand.then(() => {

        const node_subsub = treeModel.getNodeById(7) as ITreeNode;
        console.log(node_subsub.data.name);

      });

    });
  }

}
